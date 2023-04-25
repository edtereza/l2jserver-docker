<?php
namespace Application\Controller;

use Interop\Container\ContainerInterface;
use Zend\View\Model\JsonModel;

class SessionController extends ApplicationController
{

    public function __construct(ContainerInterface $ContainerInterface)
    {
        parent::__construct($ContainerInterface);
    }

    public function resumeAction()
    {
        $UUID = $this->getParam('uuid');
        $IPv4 = $this->getParam('ipv4');
        $IPv4 = ($IPv4 == null ? $this->getIPv4() : $IPv4);
        $Token = $this->requestToken($UUID, $IPv4);
        if ($Token != null && $this->isLoguedIn()) {
            $LinkedAccount = $this->requestData('linked-account', 'GET');
            if ($LinkedAccount == null) {
                // :: Retornando resposta positiva
                return new JsonModel([
                    'goto' => $this->url()->fromRoute('login')
                ]);
            } else {
                // :: Recuperando pessoa retornada no TOKEN
                $Person = $this->getPerson();
                $Parent = $this->getParent();
                // :: Verificando se o a conta é a unica válida no ambiente
                if ($LinkedAccount['results'] == 1 && $LinkedAccount['records'][0]['dbid'] == $Person['dbid'] && $Parent == null) {
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
                } // :: Verificando se o a conta é a unica válida no ambiente
                else if ($LinkedAccount['results'] > 1 && $Parent == null) {
                    // :: Retornando resposta positiva encaminhando as contas vinculadas
                    return new JsonModel([
                        'goto' => $this->url()->fromRoute('linked-account')
                    ]);
                } // :: Verificando se o a conta é a unica válida no ambiente
                else if ($LinkedAccount['results'] > 1 && $Parent != null) {
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
                    return new JsonModel([
                        'goto' => $this->url()->fromRoute('login')
                    ]);
                }
            }
        } else if ($Token != null && ! $this->isLoguedIn()) {
            return new JsonModel([
                'goto' => $this->url()->fromRoute('login'),
                'token' => $Token
            ]);
        } else {
            return new JsonModel([
                'goto' => $this->url()->fromRoute('device/unknow'),
                'token' => $Token
            ]);
        }
    }

    public function refreshAction()
    {
        $IPv4 = $this->getParam('ipv4');
        $Device = $this->getDevice();
        if ($Device != null && $IPv4 != null)
            $this->requestData('token/refresh', 'POST', [
                'ipv4' => $IPv4
            ]);
    }

    public function tokenAction()
    {
        if (! $this->isAjax()) {
            return $this->goTo('splash');
        } else {
            // :: Retorno
            return new JsonModel($this->requestData('firebase', 'POST', [
                'token' => $this->getParam('token')
            ]));
        }
    }
}