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

    public function mainAction()
    {
        if (! $this->isAjax()) {
            return $this->goTo('splash');
        } else if ($this->isLoguedIn()) {
            $Person = $this->getPerson();
            $Person['photo'] = $this->requestData('profile/photo', 'GET');
            $Parent = $this->getParent();
            // :: Inicializando o model com os dados
            $ViewModel = new ViewModel([
                'Person' => $Person,
                'Parent' => $Parent
            ]);
            // Definindo o template
            $ViewModel->setTemplate('application/menu/main');
            // Retornando exibição
            echo $this->ContainerInterface->get('ViewRenderer')->render($ViewModel);
            return $this->getResponse();
        }
        $this->setCode(401);
        return $this->getResponse();
    }
}