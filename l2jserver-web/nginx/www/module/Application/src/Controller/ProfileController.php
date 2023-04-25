<?php
namespace Application\Controller;

use Interop\Container\ContainerInterface;
use Zend\View\Model\ViewModel;
use Zend\View\Model\JsonModel;

class ProfileController extends ApplicationController
{

    public function __construct(ContainerInterface $ContainerInterface)
    {
        parent::__construct($ContainerInterface);
    }

    public function profileAction()
    {
        if (! $this->isAjax()) {
            return $this->goTo('splash');
        } else {
            // :: Requisitando perfil da API
            $Profile = $this->requestData('profile', 'GET');
            // :: Verificando se o PROFILE foi retornado
            if (isset($Profile['dbid'])) {
                // :: Requisitando foto da API
                $Photo = $this->requestData('profile/photo', 'GET');
                // :: Inicializando o model com os dados
                $ViewModel = new ViewModel([
                    'Photo' => $Photo,
                    'Profile' => $Profile
                ]);
                // Exibindo a tela do home
                $ViewModel->setTemplate('application/profile/profile');
                // :: Ajustando dados do container
                echo $this->ContainerInterface->get('ViewRenderer')->render($ViewModel);
                return $this->getResponse();
            } else {
                return $this->isExpired();
            }
        }
    }

    public function profileMetricAction()
    {
        if (! $this->isAjax()) {
            return $this->goTo('splash');
        } else if ($this->isPost()) {
            // :: Recuperando parametros
            $Params = $this->getParams();
            // :: Atualizando PESO
            $Weight = $this->requestData('profile/weight', 'PUT', [
                'value' => $Params['weight']
            ]);
            // :: Atualizando ALTURA
            $Height = $this->requestData('profile/height', 'PUT', [
                'value' => $Params['height']
            ]);
            return new JsonModel([$Weight,$Height]);
        } else {
            // :: Retornando resposta positiva
            return new JsonModel([
                'code' => 999,
                'info' => 'Erro na Requisição',
                'data' => 'Não é possível efetuar a alteração dos dados desejados no momento.<br/><br/>Tente novamente mais tarde...'
            ]);
        }
    }
}