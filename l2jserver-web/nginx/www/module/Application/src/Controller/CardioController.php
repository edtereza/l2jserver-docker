<?php
namespace Application\Controller;

use Interop\Container\ContainerInterface;
use Zend\View\Model\ViewModel;

class CardioController extends ApplicationController
{

    public function __construct(ContainerInterface $ContainerInterface)
    {
        parent::__construct($ContainerInterface);
    }

    public function activityAction()
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
                // :: Requisitando foto da API
                $Photo = $this->requestData('profile/photo', 'GET');
                // :: Requisitando perfil da API
                $Profile = $this->requestData('profile', 'GET');
                // :: Inicializando o model com os dados
                $ViewModel = new ViewModel([
                    'Photo' => $Photo,
                    'Profile' => $Profile
                ]);
                // :: Verificando se o profile não foi carregado
                if ($Profile == null) {
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
}