<?php
namespace Application\Controller;

use Interop\Container\ContainerInterface;
use Zend\View\Model\ViewModel;
use Zend\View\Model\JsonModel;

class SettingsController extends ApplicationController
{

    public function __construct(ContainerInterface $ContainerInterface)
    {
        parent::__construct($ContainerInterface);
    }

    public function settingsAction()
    {
        if (! $this->isAjax()) {
            return $this->goTo('splash');
        } else if (! $this->isLoguedIn()) {
            return $this->isExpired();
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
                $ViewModel->setTemplate('application/settings/settings');
                // :: Ajustando dados do container
                echo $this->ContainerInterface->get('ViewRenderer')->render($ViewModel);
                return $this->getResponse();
            } else {
                return $this->isExpired();
            }
        }
    }
    
    public function settingsPrivacyAction()
    {
        if (! $this->isAjax()) {
            return $this->goTo('splash');
        } else if (! $this->isLoguedIn()) {
            return $this->isExpired();
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
                $ViewModel->setTemplate('application/settings/settings-privacy');
                // :: Ajustando dados do container
                echo $this->ContainerInterface->get('ViewRenderer')->render($ViewModel);
                return $this->getResponse();
            } else {
                return $this->isExpired();
            }
        }
    }

    public function settingsProfileAction()
    {
        if (! $this->isAjax()) {
            return $this->goTo('splash');
        } else if (! $this->isLoguedIn()) {
            return $this->isExpired();
        } else if ($this->isPost()) {
            // :: Recuperando parametros
            $Params = $this->getParams();
            // :: Normalizando parametros
            $Params['nickname'] = isset($Params['nickname']) ? $Params['nickname'] : null;
            $Params['weight'] = isset($Params['weight']) ? $Params['weight'] : null;
            $Params['weight'] = ($Params['weight'] != null ? intval($Params['weight']) : $Params['weight']);
            $Params['height'] = isset($Params['height']) ? $Params['height'] : null;
            $Params['height'] = ($Params['height'] != null ? intval($Params['height']) : $Params['height']);
            // :: Verificando se o apelido deve ser atualizado
            if ($Params['nickname'] != null)
                // :: Atualizando apelido
                $this->requestData('profile', 'PUT', [
                    'nickname' => $Params['nickname']
                ]);
            // :: Verificando se a altura deve ser atualizada
            if ($Params['weight'] != null)
                // :: Atualizando altura
                $this->requestData('profile/weight', 'PUT', [
                    'value' => $Params['weight']
                ]);
            // :: Verificando se o peso deve ser atualizado
            if ($Params['height'] != null)
                // :: Atualizando peso
                $this->requestData('profile/height', 'PUT', [
                    'value' => $Params['height']
                ]);
            // :: Retornando sucesso
            return new JsonModel([
                'success' => true,
                'message' => [
                    'title' => 'DADOS ATUALIZADOS',
                    'html' => 'Seus dados foram atualizados com sucesso.',
                    'type' => 'success'
                ]
            ]);
        } else {
            // :: Requisitando perfil da API
            $Profile = $this->requestData('profile', 'GET');
            // :: Verificando se o PROFILE foi retornado
            if (isset($Profile['dbid'])) {
                // :: Requisitando foto da API
                $Photo = $this->requestData('profile/photo', 'GET');
                // :: Inicializando o model com os dados
                $ViewModel = new ViewModel([
                    'Profile' => $Profile,
                    'Photo' => $Photo
                ]);
                // Exibindo a tela do home
                $ViewModel->setTemplate('application/settings/settings-profile');
                // :: Ajustando dados do container
                echo $this->ContainerInterface->get('ViewRenderer')->render($ViewModel);
                return $this->getResponse();
            } else {
                return $this->isExpired();
            }
        }
    }

    public function settingsPlanAction()
    {
        if (! $this->isAjax()) {
            return $this->goTo('splash');
        } else if (! $this->isLoguedIn()) {
            return $this->isExpired();
        } else {
            // :: Requisitando perfil da API
            $Profile = $this->requestData('profile', 'GET');
            // :: Verificando se o PROFILE foi retornado
            if (isset($Profile['dbid'])) {
                // :: Requisitando foto da API
                $Photo = $this->requestData('profile/photo', 'GET');
                // :: Requisitando foto da API
                $Plan = $this->requestData('profile/plan', 'GET');
                // :: Inicializando o model com os dados
                $ViewModel = new ViewModel([
                    'Profile' => $Profile,
                    'Photo' => $Photo,
                    'Plan' => $Plan
                ]);
                // Exibindo a tela do home
                $ViewModel->setTemplate('application/settings/settings-plan');
                // :: Ajustando dados do container
                echo $this->ContainerInterface->get('ViewRenderer')->render($ViewModel);
                return $this->getResponse();
            } else {
                return $this->isExpired();
            }
        }
    }

    public function settingsBiometricAction()
    {
        if (! $this->isAjax()) {
            return $this->goTo('splash');
        } else if (! $this->isLoguedIn()) {
            return $this->isExpired();
        } else if ($this->isPost()) {
            // :: Recuperando parametros
            $Params = $this->getParams();
            // :: Normalizando parametros
            $Params['fingerprint'] = isset($Params['fingerprint']) ? $Params['fingerprint'] : null;
            $Params['fingerprint'] = ($Params['fingerprint'] == '1' ? true : false);
            $Params['face_recognition'] = isset($Params['face_recognition']) ? $Params['face_recognition'] : null;
            $Params['face_recognition'] = ($Params['face_recognition'] == '1' ? true : false);
            // :: Requisitando atualização
            $Biometric = $this->requestData('profile/biometric', 'PUT', $Params);
            // :: Verificando se os dados foram atualizados
            if (isset($Biometric['fingerprint']))
                return new JsonModel([
                    'success' => true,
                    'message' => [
                        'title' => 'PERMISSÕES ATUALIZADAS',
                        'html' => 'Sua permissão de utilização de seus dados biométricos foram atualizados com sucesso.',
                        'type' => 'success'
                    ],
                    'params' => $Params,
                    'biometric' => $Biometric
                ]);
            else
                return new JsonModel([
                    'success' => false,
                    'message' => [
                        'title' => 'FALHA NA SOLICITAÇÃO',
                        'html' => 'Houve um ou mais erros relacionados a atualização da sua permissão de utilização de seus dados biométricos.<br/><br/>Tente novamente...'
                    ],
                    'params' => $Params,
                    'biometric' => $Biometric
                ]);
        } else {
            // :: Requisitando perfil da API
            $Profile = $this->requestData('profile', 'GET');
            // :: Verificando se o PROFILE foi retornado
            if (isset($Profile['dbid'])) {
                // :: Requisitando perfil da API
                $Biometric = $this->requestData('profile/biometric', 'GET');
                // :: Inicializando o model com os dados
                $ViewModel = new ViewModel([
                    'Profile' => $Profile,
                    'Biometric' => $Biometric
                ]);
                // Exibindo a tela do home
                $ViewModel->setTemplate('application/settings/settings-biometric');
                // :: Ajustando dados do container
                echo $this->ContainerInterface->get('ViewRenderer')->render($ViewModel);
                return $this->getResponse();
            } else {
                return $this->isExpired();
            }
        }
    }

    public function settingsNotificationAction()
    {
        if (! $this->isAjax()) {
            return $this->goTo('splash');
        } else if (! $this->isLoguedIn()) {
            return $this->isExpired();
        } else if ($this->isPost()) {
            // :: Recuperando parametros
            $Params = $this->getParams();
            // :: Normalizando parametros
            $Params['sms'] = isset($Params['sms']) ? $Params['sms'] : null;
            $Params['sms'] = ($Params['sms'] == '1' ? true : false);
            $Params['push'] = isset($Params['push']) ? $Params['push'] : null;
            $Params['push'] = ($Params['push'] == '1' ? true : false);
            $Params['mail'] = isset($Params['mail']) ? $Params['mail'] : null;
            $Params['mail'] = ($Params['mail'] == '1' ? true : false);
            $Params['whatsapp'] = isset($Params['whatsapp']) ? $Params['whatsapp'] : null;
            $Params['whatsapp'] = ($Params['whatsapp'] == '1' ? true : false);
            // :: Requisitando atualização
            $Notification = $this->requestData('profile/notification', 'PUT', $Params);
            // :: Verificando se os dados foram atualizados
            if (isset($Notification['sms']))
                return new JsonModel([
                    'success' => true,
                    'message' => [
                        'title' => 'PERMISSÕES ATUALIZADAS',
                        'html' => 'Sua permissão de notificação foi atualizada com sucesso.',
                        'type' => 'success'
                    ],
                    'params' => $Params,
                    'notification' => $Notification
                ]);
            else
                return new JsonModel([
                    'success' => false,
                    'message' => [
                        'title' => 'FALHA NA SOLICITAÇÃO',
                        'html' => 'Houve um ou mais erros relacionados a atualização da sua permissão de notificação.<br/><br/>Tente novamente...'
                    ],
                    'params' => $Params,
                    'notification' => $Notification
                ]);
        } else {
            // :: Requisitando perfil da API
            $Profile = $this->requestData('profile', 'GET');
            // :: Verificando se o PROFILE foi retornado
            if (isset($Profile['dbid'])) {
                // :: Requisitando perfil da API
                $Notification = $this->requestData('profile/notification', 'GET');
                // :: Inicializando o model com os dados
                $ViewModel = new ViewModel([
                    'Profile' => $Profile,
                    'Notification' => $Notification
                ]);
                // Exibindo a tela do home
                $ViewModel->setTemplate('application/settings/settings-notification');
                // :: Ajustando dados do container
                echo $this->ContainerInterface->get('ViewRenderer')->render($ViewModel);
                return $this->getResponse();
            } else {
                return $this->isExpired();
            }
        }
    }
}