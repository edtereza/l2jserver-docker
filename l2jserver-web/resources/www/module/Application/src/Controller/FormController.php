<?php
namespace Application\Controller;

use Interop\Container\ContainerInterface;
use Zend\View\Model\ViewModel;
use Zend\View\Model\JsonModel;

class FormController extends ApplicationController
{

    public function __construct(ContainerInterface $ContainerInterface)
    {
        parent::__construct($ContainerInterface);
    }

    public function formAction()
    {
        if (! $this->isAjax()) {
            return $this->goTo('splash');
        } else if ($this->isPost()) {
            // :: Recuperando parametros
            $Params = $this->getParams();
            // :: Recuperando código do formulario
            $Form = $this->params()->fromRoute('form_id');
            // :: Verificando se o formulario não foi informado
            if ($Form == null) {
                // :: Recuperando formulários pendentes
                $Forms = $this->requestData('form/pending', 'GET');
                if (count($Forms) > 0)
                    $Form = $Forms[0]['dbid'];
            }
            // :: ajustando código do formulario nos parametros
            $Params['form'] = $Form;
            // :: Recuperando dados remotos
            $Request = $this->requestData('/form/answer', 'POST', $Params);
            // :: Verificando se a requisição foi completada com sucesso
            if ($Request !== null && isset($Request['success']) && $Request['success'] == true) {
                // :: Recuperando formulários pendentes
                $Forms = $this->requestData('form/pending', 'GET');
                $Redirect = $this->url()->fromRoute('home');
                if (count($Forms) > 0)
                    $Redirect = $this->url()->fromRoute('form') . '/' . $Forms[0]['dbid'];
                return new JsonModel([
                    'success' => true,
                    'message' => [
                        'title' => 'Dados Atualizados',
                        'html' => 'Suas respostas foram enviadas e armazenadas com sucesso.'
                    ],
                    'goto' => $Redirect
                ]);
            } else {
                return new JsonModel([
                    'success' => false,
                    'message' => [
                        'title' => 'Erro no Processamento',
                        'html' => 'Não foi possível enviar suas respostas neste momento.<br/><br/>Tente novamente...'
                    ]
                ]);
            }
        } else {
            // ::
            $Photo = $this->requestData('/profile/photo', 'GET');
            $Profile = $this->requestData('/profile', 'GET');
            // :: Recuperando formulários pendentes
            $Forms = $this->requestData('form/pending', 'GET');
            if (count($Forms) > 0) {
                // :: Recuperando código do formulario
                $Form = $Forms[0]['dbid'];
                // :: Recuperando dados remotos
                $Form = $this->requestData('/form', 'POST', [
                    'form' => $Form
                ]);
                // :: Inicializando o model com os dados
                $ViewModel = new ViewModel([
                    'Form' => $Form,
                    'Photo' => $Photo,
                    'Profile' => $Profile
                ]);
                $ViewModel->setTemplate('application/form/form');
            } else {
                $Person = $this->getPerson();
                $Person['photo'] = $this->requestData('profile/photo', 'GET');
                $Person['qrcode'] = $this->requestData('profile/qrcode', 'GET');
                // :: Inicializando o model com os dados
                $ViewModel = new ViewModel([
                    'Person' => $Person,
                    'Redirect' => $this->getRedirect()
                ]);
                $ViewModel->setTemplate('application/home/home');
            }
            // :: Renderizando o model
            echo $this->ContainerInterface->get('ViewRenderer')->render($ViewModel);
            // :: Exibindo o model
            return $this->getResponse();
        }
    }
}