<?php
namespace Application\Controller;

use Interop\Container\ContainerInterface;
use Zend\Mvc\MvcEvent;
use Zend\Mvc\Controller\AbstractActionController;
use GuzzleHttp\Client;
use Zend\Mvc\Console\View\ViewModel;
use Guzzle\Http\Exception\RequestException;

class ApplicationController extends AbstractActionController
{

    private $_Version = '1.0.0';

    private $_Key = 'f5976879-07e1-4fa8-a1f1-dbf6c33f40b2';

    private $_Pass = '0a0ee9cb-2432-4961-925d-25ccf3f8dc06';

    private $_Endpoint = 'https://api.basicgym.com.br/mobile/v1';

    private $_Token = null;

    private $_Person = null;

    private $_Parent = null;

    private $_Device = null;

    private $_RAW;

    protected $SessionManager = null;

    protected $ServiceManager = null;

    protected $ContainerInterface = null;

    public function __construct(ContainerInterface $ContainerInterface)
    {
        $this->ContainerInterface = $ContainerInterface;
        $this->SessionManager = $this->ContainerInterface->get('Zend\Session\SessionManager');
    }

    public function Debug($Data)
    {
        if (! is_string($Data))
            $Data = json_encode($Data);
        error_log($Data);
    }

    public function onDispatch(MvcEvent $MvcEvent)
    {
        parent::onDispatch($MvcEvent);
    }

    public function isExpired()
    {
        $Person = $this->getPerson();
        $ViewModel = new ViewModel([
            'Person' => $Person
        ]);
        $ViewModel->setTemplate('application/authentication/expired');
        echo $this->ContainerInterface->get('ViewRenderer')->render($ViewModel);
        return $this->getResponse();
    }

    public function goTo($Route, $Params = null)
    {
        if ($Params != null && is_array($Params))
            $urlGoTo = $this->url()->fromRoute($Route, $Params);
        else
            $urlGoTo = $this->url()->fromRoute($Route);
        $this->getResponse()
            ->getHeaders()
            ->addHeaderLine('Location', $urlGoTo);
        return $this->getResponse()->setStatusCode(302);
    }

    public function goToExternal($URL)
    {
        $this->getResponse()
            ->getHeaders()
            ->addHeaderLine('Location', $URL);
        return $this->getResponse()->setStatusCode(302);
    }

    public function getHeader($Header, $Default = null)
    {
        $getRequest = $this->getRequest();
        if ($getRequest->getHeader($Header, $Default) != null)
            return $getRequest->getHeader($Header, $Default)->getFieldValue();
        return null;
    }

    public function getHeaders()
    {
        $getHeaders = [];
        foreach ($_SERVER as $name => $value) {
            if (substr($name, 0, 5) == 'HTTP_')
                $getHeaders[str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))))] = $value;
        }
        return $getHeaders;
    }

    public function setCode($Code)
    {
        $getResponse = $this->getResponse();
        $getResponse->setStatusCode($Code);
    }

    public function noCache()
    {
        $this->getResponse()
            ->getHeaders()
            ->addHeaderLine('Cache-Control', 'no-cache, must-revalidate', true);
        $this->getResponse()
            ->getHeaders()
            ->addHeaderLine('Pragma', 'no-cache', true);
        $this->getResponse()
            ->getHeaders()
            ->addHeaderLine('Expires', 'Sat, 01 Jul 2000 00:00:00 GMT', true);
    }

    public function getParam($Param)
    {
        $Data = $this->params()->fromPost($Param);
        if ($Data == null)
            $Data = $this->params()->fromRoute($Param);
        return $Data;
    }

    public function getParams($HasArray = true)
    {
        $_getParams = $this->getJSON($HasArray);
        if ($_getParams == null) {
            $_getParams = filter_input_array(INPUT_POST);
        }
        if ($_getParams == null) {
            $_getParams = filter_input_array(INPUT_GET);
        }
        return $_getParams;
    }

    public function getBearer()
    {
        return $this->getHeader("X-Bearer");
    }

    public function getIPv4()
    {
        $IPv4 = $this->getRequest()
            ->getServer()
            ->get('HTTP_X_REAL_IP');
        $IPv4 = ($IPv4 == null) ? $this->getRequest()
            ->getServer()
            ->get('REMOTE_ADDR') : $IPv4;
        return $IPv4;
    }

    public function getRaw()
    {
        if ($this->_RAW == null)
            $this->_RAW = file_get_contents('php://input');
        if (strlen($this->_RAW) == 0)
            $this->_RAW = null;
        return $this->_RAW;
    }

    public function getJSON($HasArray = false)
    {
        $RAW = $this->getRaw();
        if ($RAW != null) {
            try {
                $JSON = json_decode($RAW, $HasArray);
            } catch (\Exception $Exception) {
                $JSON = null;
            }
            return $JSON;
        }
        return null;
    }

    public function getMethod()
    {
        return strtoupper($this->getRequest()->getMethod());
    }

    public function isGet()
    {
        return ($this->getMethod() == 'GET' ? true : false);
    }

    public function isPost()
    {
        return ($this->getMethod() == 'POST' ? true : false);
    }

    public function isPut()
    {
        return ($this->getMethod() == 'PUT' ? true : false);
    }

    public function isDelete()
    {
        return ($this->getMethod() == 'DELETE' ? true : false);
    }

    public function isAjax()
    {
        return $this->request->isXmlHttpRequest();
    }

    public function getRedirectURL()
    {
        return $this->getRequest()
            ->getServer()
            ->get('REDIRECT_URL');
    }

    public function getEndpoint()
    {
        return $this->getRedirectURL();
    }

    public function randomString($length = 10)
    {
        return substr(str_shuffle(str_repeat($x = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', ceil($length / strlen($x)))), 1, $length);
    }

    public function generateToken()
    {
        return $this->randomString(256);
    }

    public function toString($Data)
    {
        if ($Data != null) {
            try {
                $JSON = json_encode($Data);
            } catch (\Exception $Exception) {
                $JSON = null;
            }
            return $JSON;
        }
        return null;
    }

    public function getToken($Force = false)
    {
        if ($this->_Token != null && $Force == false)
            return $this->_Token;
        $this->requestToken($this->SessionManager->getStorage()
            ->offsetGet('uuid'), null);
        return $this->_Token;
    }

    public function setDevice($Device)
    {
        if ($Device['uuid'] != null)
            $this->SessionManager->getStorage()->offsetSet('uuid', $Device['uuid']);
        else {
            $this->_Device = null;
            $this->SessionManager->getStorage()->offsetSet('uuid', null);
        }
    }

    public function getDevice()
    {
        if ($this->_Device != null)
            return $this->_Device;
        if ($this->SessionManager->getStorage()->offsetExists('uuid'))
            $this->requestToken($this->SessionManager->getStorage()
                ->offsetGet('uuid'), $this->SessionManager->getStorage()
                ->offsetGet('ipv4'));
        return $this->_Device;
    }

    public function setPerson($Person)
    {
        if (isset($Person['dbid']))
            $this->SessionManager->getStorage()->offsetSet('person', $Person['dbid']);
        else {
            $this->_Person = null;
            $this->SessionManager->getStorage()->offsetSet('person', null);
        }
    }

    public function getPerson($Force = false)
    {
        if ($this->_Person != null && $Force == false)
            return $this->_Person;
        $this->requestToken($this->SessionManager->getStorage()
            ->offsetGet('uuid'), null);
        return $this->_Person;
    }

    public function setParent($Person)
    {
        if (isset($Person['dbid']))
            $this->SessionManager->getStorage()->offsetSet('parent', $Person['dbid']);
        else {
            $this->_Parent = null;
            $this->SessionManager->getStorage()->offsetSet('parent', null);
        }
    }

    public function getParent($Force = false)
    {
        if ($this->_Parent != null && $Force == false)
            return $this->_Parent;
        $this->requestToken($this->SessionManager->getStorage()
            ->offsetGet('uuid'), null);
        return $this->_Parent;
    }

    public function isLoguedIn()
    {
        if ($this->_Person != null)
            return true;
        if ($this->SessionManager->getStorage()->offsetExists('person')) {
            $Person = $this->SessionManager->getStorage()->offsetGet('person');
            if ($Person != null && is_numeric($Person)) {
                return true;
            }
        }
        return false;
    }

    public function setRedirect($URL)
    {
        $this->SessionManager->getStorage()->offsetSet('redirect', $URL);
    }

    public function getRedirect($CleanUp = true)
    {
        $_getRedirect = $this->SessionManager->getStorage()->offsetGet('redirect');
        if ($CleanUp)
            $this->SessionManager->getStorage()->offsetSet('redirect', null);
        return $_getRedirect;
    }

    public function requestToken($UUID, $IPv4 = null)
    {
        if ($this->_Token === null) {
            // :: URL
            $_requestTokenURL = $this->_Endpoint . '/token';
            // :: Inicializando headers
            $_requestTokenHeaders = [
                'X-Client-ID' => $this->_Key,
                'X-Client-Secret' => $this->_Pass,
                'X-Device-UUID' => $UUID,
                'X-Device-IPv4' => $IPv4,
                'X-Device-Type' => 1
            ];
            // :: Inicializando opções
            $_requestDataOptions = [
                'json' => [
                    'version' => $this->_Version,
                    'dataset' => [
                        'userAgent' => $_SERVER['HTTP_USER_AGENT']
                    ]
                ]
            ];
            // :: Inicializando cliente
            $_requestTokenClient = new Client([
                'timeout' => 30,
                'headers' => $_requestTokenHeaders
            ]);
            //:: DEBUG
            $this->Debug('requestToken');
            $this->Debug([
                'endpoint' => $_requestTokenURL,
                'headers' => $_requestTokenHeaders,
                'options' => $_requestDataOptions,
            ]);
            // :: Inicializando variáveis
            // :: Executando solicitação
            $_requestTokenRequest = $_requestTokenClient->post($_requestTokenURL, $_requestDataOptions);
            $_requestTokenContents = null;
            $_requestTokenStatusCode = 0;
            // :: Requisição a API
            try {

                // :: Recuperando dados no bearer
                $_requestTokenContents = $_requestTokenRequest->getBody()->getContents();
                // :: Recuperando código da resposta
                $_requestTokenStatusCode = $_requestTokenRequest->getStatusCode();
            } catch (RequestException $RequestException) {
                // :: Registrando evento no log
                error_log("Mobile::requestToken ~ RequestException :: " . json_encode($RequestException));
                // :: Verificando se a requisição têm uma resposta
                if ($RequestException->hasResponse()) {
                    // Populate return object
                    try {
                        // :: Processando dados de conteudo
                        $_exceptionStatusCode = $RequestException->getResponse()->getStatusCode();
                        $_exceptionHeaders = $RequestException->getResponse()->getHeaders();
                        $_exceptionContents = json_decode($RequestException->getResponse()
                            ->getBody()
                            ->getContents(), true);
                        // :: Registrando evento no log
                        error_log("Mobile::requestToken ~ RequestException/Response");
                        error_log("- Code.....:" . (is_numeric($_exceptionStatusCode) ? intval($_exceptionStatusCode) : ($_exceptionStatusCode == null ? "999" : $_exceptionStatusCode)));
                        error_log("- Headers..:" . json_encode($_exceptionHeaders));
                        error_log("- Contents.:" . json_encode($_exceptionContents));
                        // :: Reparando conteudo ao resultado
                        $_requestTokenContents = $_exceptionContents;
                    } catch (\Exception $Exception) {
                        //:: Gerando retorno da exception
                        $_exception = [
                            'class' => get_class($Exception),
                            'file' => $Exception->getFile(),
                            'line' => $Exception->getLine(),
                            'message' => $Exception->getMessage(),
                            'tracing' => $Exception->getTraceAsString()
                        ];
                        //:: DEBUG
                        $this->Debug('requestToken :: Exception on Parse');
                        $this->Debug($_exception);
                    }
                }
                //:: Gerando retorno da exception
                $_exception = [
                    'class' => get_class($RequestException),
                    'file' => $RequestException->getFile(),
                    'line' => $RequestException->getLine(),
                    'message' => $RequestException->getMessage(),
                    'tracing' => $RequestException->getTraceAsString()
                ];
                //:: DEBUG
                $this->Debug('requestToken :: Exception');
                $this->Debug($_exception);
            } catch (\Exception $Exception) {
                //:: Gerando retorno da exception
                $_exception = [
                    'class' => get_class($Exception),
                    'file' => $Exception->getFile(),
                    'line' => $Exception->getLine(),
                    'message' => $Exception->getMessage(),
                    'tracing' => $Exception->getTraceAsString()
                ];
                //:: DEBUG
                $this->Debug('requestToken :: Exception');
                $this->Debug($_exception);
            }
            // ::
            $_requestTokenJSON = null;
            // :: Verificando se tudo foi dentro do esperado
            if ($_requestTokenStatusCode == 200) {
                // Populate return object
                try {
                    $_requestTokenJSON = json_decode($_requestTokenContents, true);
                } catch (\Exception $Exception) {
                    $_requestTokenJSON = null;
                }
            }
            // :: Verificando se o JSON foi retornado
            if ($_requestTokenJSON !== null) {
                // :: Ajustando valor do TOKEN
                $this->_Token = isset($_requestTokenJSON['token']) ? $_requestTokenJSON['token'] : null;
                // :: Verificando se o token foi retornado
                if ($this->_Token != null) {
                    // :: Ajustando valor do dispositivo
                    $this->_Device = $_requestTokenJSON['device'];
                    // :: Ajustando valor da pessoa conectada
                    $this->_Person = ($_requestTokenJSON['session'] != null ? $_requestTokenJSON['session']['person'] : null);
                    // :: Ajustando valor da pessoa conectada
                    $this->_Parent = ($_requestTokenJSON['session'] != null ? $_requestTokenJSON['session']['parent'] : null);
                }
                // :: Verificando se a existe alguem conectado
                $this->setDevice($this->_Device);
                // :: Verificando se a existe alguem conectado
                $this->setPerson($this->_Person);
            }
        }
        // :: Retornando Token
        return $this->_Token;
    }

    public function requestData($Endpoint, $Method, $Params = null)
    {
        // :: Recuperando o token
        $Token = $this->getToken();
        // :: Verificando se o token foi recuperado
        if ($Token != null) {
            // :: URL
            $_requestDataURL = $this->_Endpoint . (substr($Endpoint, 0, 1) != '/' ? '/' : '') . $Endpoint;
            // :: Inicializando headers
            $_requestDataHeaders = [
                'X-Bearer' => $Token
            ];
            // :: Inicializando opções
            $_requestDataOptions = [];
            // :: Inicializando cliente
            $_requestDataClient = new Client([
                'timeout' => 30,
                'headers' => $_requestDataHeaders
            ]);
            // :: Verificando se os parametros foram informados
            if ($Params != null)
                $_requestDataOptions['json'] = $Params;
            // :: Inicializando resposta
            $_requestDataRequest = null;
            // :: Verificando metodo GET
            if (strtoupper($Method) == 'GET')
                $_requestDataRequest = $_requestDataClient->get($_requestDataURL, $_requestDataOptions);
            // :: Verificando metodo PUT
            if (strtoupper($Method) == 'PUT')
                // :: Executando solicitação (PUT)
                $_requestDataRequest = $_requestDataClient->put($_requestDataURL, $_requestDataOptions);
            // :: Verificando metodo POST
            if (strtoupper($Method) == 'POST')
                // :: Executando solicitação (POST)
                $_requestDataRequest = $_requestDataClient->post($_requestDataURL, $_requestDataOptions);
            // :: Recuperando corpo da resposta
            $_requestDataContents = $_requestDataRequest->getBody()->getContents();
            // :: Recuperando código da resposta
            $_requestDataStatusCode = $_requestDataRequest->getStatusCode();
            // :: Verificando se tudo foi dentro do esperado
            if ($_requestDataStatusCode == 200) {
                // Populate return object
                try {
                    $_requestDataJSON = json_decode($_requestDataContents, true);
                } catch (\Exception $Exception) {
                    $_requestDataJSON = null;
                }
            }
            // :: Retornando dados
            return $_requestDataJSON;
        }
        return null;
    }

    private function _getCacheHash($Data)
    {
        if (! is_string($Data) || (is_string($Data) && strlen($Data) != 32)) {
            if (is_array($Data) || is_object($Data))
                $Data = json_encode($Data);
            else if (is_numeric($Data))
                $Data = json_encode($Data . '');
        }
        return md5($Data);
    }

    public function setCache($Data, $Key)
    {
        $Path = './data/' . $this->_getCacheHash($Key) . '.cache';
        $File = fopen($Path, "w");
        if ($File)
            fwrite($File, json_encode($Data));
        fclose($File);
        return $this->getCache($Key);
    }

    public function getCache($Key, $Expires = 60)
    {
        $Path = './data/' . $this->_getCacheHash($Key) . '.cache';
        if (! file_exists($Path))
            return null;
        $Timestamp = filemtime($Path);
        if ($Timestamp != null && ($Timestamp + $Expires) <= time())
            return null;
        return json_decode(file_get_contents($Path), true);
    }

    public function delCache($Key)
    {
        $Path = './data/' . $this->_getCacheHash($Key) . '.cache';
        if (! file_exists($Path))
            return true;
        unlink($Path);
        if (! file_exists($Path))
            return true;
        return false;
    }
}