<?php
namespace Application\Controller;

use Interop\Container\ContainerInterface;
use Zend\View\Model\ViewModel;

class MenuController extends ApplicationController
{

    public function __construct(ContainerInterface $ContainerInterface)
    {
        parent::__construct($ContainerInterface);
    }

    public function leftAction()
    {
        if (! $this->isAjax()) {
            return $this->goTo('splash');
        } else {
            $ViewModel = new ViewModel();
            if ($this->isLoguedIn()) {
                $ViewModel->setTemplate('application/menu/left');
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