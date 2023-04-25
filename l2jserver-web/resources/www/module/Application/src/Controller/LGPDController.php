<?php
namespace Application\Controller;

use Interop\Container\ContainerInterface;
use Zend\View\Model\ViewModel;
use Zend\View\Model\JsonModel;

class LGPDController extends ApplicationController
{

    public function __construct(ContainerInterface $ContainerInterface)
    {
        parent::__construct($ContainerInterface);
    }

    public function biometricAction()
    {
        if (! $this->isAjax()) {
            return $this->goTo('splash');
        } else if ($this->isPost()) {
            $Params = [];
            $Params['fingerprint'] = true;
            $Params['face_recognition'] = true;
            // :: Requisitando atualização
            $Biometric = $this->requestData('profile/biometric', 'PUT', $Params);
            // :: Verificando se os dados foram atualizados
            if (isset($Biometric['fingerprint'])) {
                return new JsonModel([
                    'success' => true,
                    'message' => [
                        'title' => 'PERMISSÕES ATUALIZADAS',
                        'html' => 'Sua permissão de utilização de seus dados biométricos foram atualizadas com sucesso.',
                        'type' => 'success'
                    ]
                ]);
            } else
                return new JsonModel([
                    'success' => false,
                    'message' => [
                        'title' => 'FALHA NA SOLICITAÇÃO',
                        'html' => 'Houve um ou mais erros relacionados a atualização da sua permissão de utilização de seus dados biométricos.<br/><br/>Tente novamente...'
                    ]
                ]);
        } else {
            // :: Recuperando dados remotos
            $Photo = $this->requestData('/profile/photo', 'GET');
            $Profile = $this->requestData('/profile', 'GET');
            // :: Inicializando o model com os dados
            $ViewModel = new ViewModel([
                'Photo' => $Photo,
                'Profile' => $Profile
            ]);
            $ViewModel->setTemplate('application/totem/lgpd/biometric');
            echo $this->ContainerInterface->get('ViewRenderer')->render($ViewModel);
            return $this->getResponse();
        }
    }
    
    public function biometricSettingsAction()
    {
        if (! $this->isAjax()) {
            return $this->goTo('splash');
        } else if ($this->isPost()) {
            // :: Recuperando parametros
            $Params = $this->getParams();
            // :: Normalizando parametros
            $Params['global'] = isset($Params['global']) ? $Params['global'] : null;
            $Params['global'] = ($Params['global'] == '1' ? true : false);
            $Params['fingerprint'] = isset($Params['fingerprint']) ? $Params['fingerprint'] : null;
            $Params['fingerprint'] = ($Params['fingerprint'] == '1' ? true : false);
            $Params['fingerprint'] = ($Params['global'] == true ? $Params['fingerprint'] : false);
            $Params['face_recognition'] = isset($Params['face_recognition']) ? $Params['face_recognition'] : null;
            $Params['face_recognition'] = ($Params['face_recognition'] == '1' ? true : false);
            $Params['face_recognition'] = ($Params['global'] == true ? $Params['face_recognition'] : false);
            // :: Requisitando atualização
            $Biometric = $this->requestData('profile/biometric', 'PUT', $Params);
            // :: Verificando se os dados foram atualizados
            if (isset($Biometric['fingerprint'])) {
                return new JsonModel([
                    'success' => true,
                    'message' => [
                        'title' => 'PERMISSÕES ATUALIZADAS',
                        'html' => 'Sua permissão de utilização de seus dados biométricos foram atualizados com sucesso.',
                        'type' => 'success'
                    ]
                ]);
            } else
                return new JsonModel([
                    'success' => false,
                    'message' => [
                        'title' => 'FALHA NA SOLICITAÇÃO',
                        'html' => 'Houve um ou mais erros relacionados a atualização da sua permissão de utilização de seus dados biométricos.<br/><br/>Tente novamente...'
                    ]
                ]);
        } else {
            // :: Recuperando dados remotos
            $Photo = $this->requestData('/profile/photo', 'GET');
            $Profile = $this->requestData('/profile', 'GET');
            // :: Requisitando perfil da API
            $Biometric = $this->requestData('profile/biometric', 'GET');
            // :: Inicializando o model com os dados
            $ViewModel = new ViewModel([
                'Photo' => $Photo,
                'Profile' => $Profile,
                'Biometric' => $Biometric
            ]);
            $ViewModel->setTemplate('application/totem/lgpd/biometric-settings');
            echo $this->ContainerInterface->get('ViewRenderer')->render($ViewModel);
            return $this->getResponse();
        }
    }
}