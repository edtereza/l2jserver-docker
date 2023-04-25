<?php
namespace Application\Controller;

use Interop\Container\ContainerInterface;
use Zend\View\Model\ViewModel;
use Zend\View\Model\JsonModel;

class HomeController extends ApplicationController
{

    public function __construct(ContainerInterface $ContainerInterface)
    {
        parent::__construct($ContainerInterface);
    }

    public function homeAction()
    {
        if (! $this->isAjax()) {
            return $this->goTo('splash');
        } else {
            if (! $this->isLoguedIn()) {
                $ViewModel = new ViewModel();
                $ViewModel->setTemplate('application/authentication/login');
                echo $this->ContainerInterface->get('ViewRenderer')->render($ViewModel);
                return $this->getResponse();
            } else {
                $Person = $this->getPerson();
                $Person['photo'] = $this->requestData('profile/photo', 'GET');
                $Person['qrcode'] = $this->requestData('profile/qrcode', 'GET');
                // :: Inicializando o model com os dados
                $ViewModel = new ViewModel([
                    'Person' => $Person,
                    'Redirect' => $this->getRedirect()
                ]);
                // :: Verificando se o profile não foi carregado
                if ($Person == null) {
                    // :: Solicitando o logout e exibindo a tela
                    $this->SessionManager->destroy();
                    // :: Exibindo a tela de logout
                    $ViewModel->setTemplate('application/authentication/logout');
                } else {
                    // Exibindo a tela do home
                    $ViewModel->setTemplate('application/home/home');
                }
                echo $this->ContainerInterface->get('ViewRenderer')->render($ViewModel);
                return $this->getResponse();
            }
        }
    }

    public function homeQRCodeAction()
    {
        if (! $this->isAjax()) {
            return $this->goTo('splash');
        } else {
            $QRCode = [];
            if ($this->isLoguedIn())
                $QRCode = $this->requestData('profile/qrcode', 'GET');
            return new JsonModel($QRCode);
        }
    }
}