<?php
namespace Application\Controller;

use Zend\View\Model\JsonModel;
use Zend\Mvc\Console\View\ViewModel;
use Interop\Container\ContainerInterface;

class AuthenticationController extends ApplicationController
{

    public function __construct(ContainerInterface $ContainerInterface)
    {
        parent::__construct($ContainerInterface);
    }

    public function loginAction()
    {
        if (! $this->isAjax()) {
            return $this->goTo('splash');
        } else {
            if (! $this->isPost()) {
                $ViewModel = new ViewModel();
                $ViewModel->setTemplate('application/authentication/login');
                echo $this->ContainerInterface->get('ViewRenderer')->render($ViewModel);
                return $this->getResponse();
            } else {
                // :: Requisitando login
                $Request = $this->requestData('login', 'POST', [
                    'username' => $this->getParam('username'),
                    'password' => $this->getParam('password')
                ]);
                // :: Verificando se a requisição foi realizada com sucesso
                if ($Request != null && isset($Request['token'])) {
                    // :: Verificando se a sessão esta ativa
                    if ($Request['session'] != null) {
                        $LinkedAccounts = $this->requestData('linked-account', 'GET');
                        if ($LinkedAccounts == null) {
                            // :: Retornando resposta positiva
                            return new JsonModel([
                                'code' => 999,
                                'info' => 'Acesso Negado',
                                'data' => 'O acesso a este aplicativo só é permitido a alunos regularmente matriculados ou seus responsáveis.'
                            ]);
                        } else {
                            if ($LinkedAccounts['results'] == 0 || ($LinkedAccounts['results'] == 1 && $LinkedAccounts['records'][0]['dbid'] == $Request['session']['person']['dbid'])) {
                                // :: Registrando pessoa que fez o login
                                $this->setPerson($Request['session']['person']);
                                // :: Solicitando flag relacionada a aceitação dos termos de uso
                                $TermsAccepted = $this->requestData('terms/accepted', 'GET');
                                // :: Verificando se os termos foram aceitos anteriormentes
                                if (isset($TermsAccepted['accepted']) && $TermsAccepted['accepted'] == true) {
                                    // :: Recuperando formulários pendentes
                                    $Forms = $this->requestData('form/pending', 'GET');
                                    if (count($Forms) > 0)
                                        // :: Retornando resposta positiva encaminhando a HOME
                                        return new JsonModel([
                                            'goto' => $this->url()->fromRoute('form')
                                        ]);
                                    else
                                        // :: Retornando resposta positiva encaminhando a HOME
                                        return new JsonModel([
                                            'goto' => $this->url()->fromRoute('home')
                                        ]);
                                } else {
                                    // :: Retornando resposta positiva encaminhando os TERMOS
                                    return new JsonModel([
                                        'goto' => $this->url()->fromRoute('terms')
                                    ]);
                                }
                            } else {
                                // :: Retornando resposta positiva encaminhando a LINKED-ACCOUNT
                                return new JsonModel([
                                    'goto' => $this->url()->fromRoute('linked-account')
                                ]);
                            }
                        }
                    } else {
                        // :: Resetando
                        $this->setPerson(null);
                        // :: Solicitando o logout
                        $this->requestData('logout', 'POST');
                        $this->SessionManager->destroy();
                        $ViewModel = new ViewModel([
                            'Person' => null
                        ]);
                        $ViewModel->setTemplate('application/authentication/logout');
                        echo $this->ContainerInterface->get('ViewRenderer')->render($ViewModel);
                        return $this->getResponse();
                    }
                } else if ($Request != null && ! isset($Request['token']) && isset($Request['slug'])) {
                    // :: Retornando resposta positiva
                    return new JsonModel([
                        'code' => intval($Request['dbid']),
                        'info' => $Request['resume'],
                        'data' => $Request['detail']
                    ]);
                } else {
                    // :: Retornando resposta positiva
                    return new JsonModel([
                        'code' => 999,
                        'info' => 'Falha Desconhecida',
                        'data' => 'Houve uma falha desconhecida ao tentar efetuar seu login.<br/><br/>Tente novamente...'
                    ]);
                }
            }
        }
    }

    public function logoutAction()
    {
        if (! $this->isAjax()) {
            $this->requestData('logout', 'POST');
            return $this->goTo('splash');
        } else {
            $Person = $this->getPerson();
            $this->requestData('logout', 'POST');
            $this->SessionManager->destroy();
            $ViewModel = new ViewModel([
                'Person' => $Person
            ]);
            $ViewModel->setTemplate('application/authentication/logout');
            echo $this->ContainerInterface->get('ViewRenderer')->render($ViewModel);
            return $this->getResponse();
        }
    }

    public function termsAction()
    {
        if (! $this->isAjax()) {
            return $this->GoTo('splash');
        }
        if ($this->isPost()) {
            $Params = $this->getParams();
            if ($Params['event'] == 'DECLINE') {
                $this->requestData('terms/decline', 'POST');
                return new JsonModel([
                    'goto' => $this->url()->fromRoute('login')
                ]);
            } else if ($Params['event'] == 'ACCEPT') {
                $this->requestData('terms/accept', 'POST');
                return new JsonModel([
                    'goto' => $this->url()->fromRoute('home')
                ]);
            } else {
                // :: Retornando resposta positiva
                return new JsonModel([
                    'code' => 999,
                    'info' => 'Falha Desconhecida',
                    'data' => 'Houve uma falha desconhecida ao tentar executar a ação desejada.<br/><br/>Tente novamente...'
                ]);
            }
        } else {
            $Terms = $this->requestData('terms', 'GET');
            $Display = $this->params()->fromRoute('display');
            $ViewModel = new ViewModel([
                'Terms' => $Terms
            ]);
            $ViewModel->setTemplate('application/authentication/terms');
            if ($Display == 'usage')
                $ViewModel->setTemplate('application/authentication/terms/usage');
            else if ($Display == 'privacy')
                $ViewModel->setTemplate('application/authentication/terms/privacy');
            echo $this->ContainerInterface->get('ViewRenderer')->render($ViewModel);
            return $this->getResponse();
        }
    }

    public function signupAction()
    {
        if (! $this->isAjax()) {
            return $this->GoTo('splash');
        } else {
            if (! $this->isPost()) {
                $ViewModel = new ViewModel();
                $ViewModel->setTemplate('application/authentication/signup');
                echo $this->ContainerInterface->get('ViewRenderer')->render($ViewModel);
                return $this->getResponse();
            } else {
                // :: Requisitando login
                $Request = $this->requestData('signup', 'POST', [
                    'code' => $this->getParam('code'),
                    'email' => $this->getParam('email')
                ]);
                // :: Verificando se a requisição foi realizada com sucesso
                if ($Request != null && isset($Request['success']) && $Request['success'] == true) {
                    // :: Retornando resposta positiva
                    return new JsonModel([
                        'goto' => $this->url()->fromRoute('login'),
                        'code' => 0,
                        'info' => $Request['resume'],
                        'data' => $Request['detail']
                    ]);
                } else if ($Request != null && ! isset($Request['success'])) {
                    // :: Retornando resposta positiva
                    return new JsonModel([
                        'code' => intval($Request['dbid']),
                        'info' => $Request['resume'],
                        'data' => $Request['detail']
                    ]);
                } else {
                    // :: Retornando resposta positiva
                    return new JsonModel([
                        'code' => 999,
                        'info' => 'Falha Desconhecida',
                        'data' => 'Houve uma falha desconhecida ao tentar efetuar seu cadastro.<br/><br/>Tente novamente...'
                    ]);
                }
            }
        }
    }

    public function passwordRecoverAction()
    {
        if (! $this->isAjax()) {
            return $this->GoTo('splash');
        } else {
            if (! $this->isPost()) {
                $ViewModel = new ViewModel();
                $ViewModel->setTemplate('application/authentication/password-recover');
                echo $this->ContainerInterface->get('ViewRenderer')->render($ViewModel);
                return $this->getResponse();
            } else {
                // :: Requisitando login
                $Request = $this->requestData('password-recover', 'POST', [
                    'code' => $this->getParam('code'),
                    'email' => $this->getParam('email')
                ]);
                // :: Verificando se a requisição foi realizada com sucesso
                if ($Request != null && isset($Request['success']) && $Request['success'] == true) {
                    // :: Retornando resposta positiva
                    return new JsonModel([
                        'goto' => $this->url()->fromRoute('login'),
                        'code' => 0,
                        'info' => $Request['resume'],
                        'data' => $Request['detail']
                    ]);
                } else if ($Request != null && ! isset($Request['success'])) {
                    // :: Retornando resposta positiva
                    return new JsonModel([
                        'code' => intval($Request['dbid']),
                        'info' => $Request['resume'],
                        'data' => $Request['detail']
                    ]);
                } else {
                    // :: Retornando resposta positiva
                    return new JsonModel([
                        'code' => 999,
                        'info' => 'Falha Desconhecida',
                        'data' => 'Houve uma falha desconhecida ao tentar efetuar seu cadastro.<br/><br/>Tente novamente...'
                    ]);
                }
            }
        }
    }

    public function linkedAccountAction()
    {
        if (! $this->isAjax()) {
            return $this->GoTo('splash');
        } else {
            if (! $this->isPost()) {
                $LinkedAccount = $this->requestData('linked-account', 'GET');
                for ($LinkedAccountIndex = 0; $LinkedAccountIndex < $LinkedAccount['results']; $LinkedAccountIndex ++) {
                    $LinkedAccount['records'][$LinkedAccountIndex]['photo'] = $this->requestData('linked-account/photo', 'POST', [
                        'code' => $LinkedAccount['records'][$LinkedAccountIndex]['dbid']
                    ]);
                }
                $ViewModel = new ViewModel([
                    'LinkedAccount' => $LinkedAccount
                ]);
                $ViewModel->setTemplate('application/authentication/linked-account');
                echo $this->ContainerInterface->get('ViewRenderer')->render($ViewModel);
                return $this->getResponse();
            } else {
                // :: Requisitando login
                $Params = $this->getParams();
                // :: Recuperando conta PAI
                $Parent = $this->getParent();
                if ($Parent != null) {
                    // :: Efetuando o
                    $this->requestData('linked-account/logout', 'POST');
                }
                // :: Efetuando o login da conta vinculada
                $Request = $this->requestData('linked-account/login', 'POST', [
                    'code' => $Params['code']
                ]);
                // :: Recuperando informações da conta PAI
                $Parent = (isset($Request['session']['parent']));
                // :: Verificando se o login foi efetuado com sucesso
                if ($Parent != null) {
                    // :: Solicitando flag relacionada a aceitação dos termos de uso
                    $TermsAccepted = $this->requestData('terms/accepted', 'GET');
                    // :: Verificando se os termos foram aceitos anteriormentes
                    if (isset($TermsAccepted['accepted']) && $TermsAccepted['accepted'] == true) {
                        // :: Recuperando formulários pendentes
                        $Forms = $this->requestData('form/pending', 'GET');
                        if (count($Forms) > 0)
                            // :: Retornando resposta positiva encaminhando a HOME
                            return new JsonModel([
                                'goto' => $this->url()->fromRoute('form')
                            ]);
                        else
                            // :: Retornando resposta positiva encaminhando a HOME
                            return new JsonModel([
                                'goto' => $this->url()->fromRoute('home')
                            ]);
                    } else {
                        // :: Retornando resposta positiva encaminhando os TERMOS
                        return new JsonModel([
                            'goto' => $this->url()->fromRoute('terms')
                        ]);
                    }
                } else {
                    // :: Retornando resposta positiva
                    return new JsonModel([
                        'code' => 999,
                        'info' => 'Atenção',
                        'data' => 'Houve um erro ao tentar selecionar este perfil.<br/><br/>Tente novamente...'
                    ]);
                }
            }
        }
    }
}