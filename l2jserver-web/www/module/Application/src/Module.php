<?php
namespace Application;

use Zend\Mvc\MvcEvent;
use Interop\Container\ContainerInterface;
use Zend\Db\Adapter\AdapterInterface;
use Zend\Db\TableGateway\TableGateway;
use PHPMailer\PHPMailer\PHPMailer;
use Zend\View\Model\ViewModel;
use Zend\Session\SessionManager;
use Zend\Session\Container;

class Module
{

    public function onBootstrap(MvcEvent $MvcEvent)
    {
        $this->onBootstrapSession($MvcEvent);
    }

    private function onBootstrapSession(MvcEvent $MvcEvent)
    {
        // :: BASE
        $Application = $MvcEvent->getApplication();
        $EventManager = $Application->getEventManager();
        $ServiceManager = $Application->getServiceManager();
        // :: Request
        $Request = $ServiceManager->get('Request');
        // :: Session
        $SessionManager = new SessionManager();
        $SessionManager = $MvcEvent->getApplication()
            ->getServiceManager()
            ->get('Zend\Session\SessionManager');
        try {
            $SessionManager->start();
        } catch (\Exception $exception) {
            $SessionManager->destroy();
            $Router = $MvcEvent->getRouter();
            $RouteToGo = $Router->assemble(array(), array(
                'name' => 'home'
            ));
            $Response = $MvcEvent->getResponse();
            $Response->getHeaders()->addHeaderLine('Location', $RouteToGo);
            $Response->setStatusCode(302);
            return true;
        }
        // :: Session Container
        $SessionContainer = new Container('ReebokMobile');

        if (! isset($SessionContainer->started)) {
            $SessionManager->regenerateId(true);
            $SessionContainer->started = true;
            $SessionContainer->remoteAddr = $this->onBootstrapSessionIPv4($Request);
            $GlobalConfig = $ServiceManager->get('Config');
            if (! isset($GlobalConfig['session'])) {
                return;
            }
            $SessionConfig = $GlobalConfig['session'];
            if (isset($SessionConfig['validators'])) {
                $ValidatorChain = $SessionManager->getValidatorChain();
                foreach ($SessionConfig['validators'] as $SessionConfigValidator) {
                    switch ($SessionConfigValidator) {
                        case 'Zend\Session\Validator\HttpUserAgent':
                            $SessionConfigValidator = new $SessionConfigValidator($SessionContainer->httpUserAgent);
                            break;
                        case 'Zend\Session\Validator\RemoteAddr':
                            $SessionConfigValidator = new $SessionConfigValidator($SessionContainer->remoteAddr);
                            break;
                        default:
                            $SessionConfigValidator = new $SessionConfigValidator();
                    }
                    $ValidatorChain->attach('session.validate', array(
                        $SessionConfigValidator,
                        'isValid'
                    ));
                }
            }
        }
        $EventManager->attach(MvcEvent::EVENT_DISPATCH, function ($MvcEvent) use ($Request) {
            // :: PRE
        }, 100);

        $EventManager->attach(MvcEvent::EVENT_DISPATCH, function ($MvcEvent) use ($Request) {
            // :: POST
        }, - 100);
        return true;
    }

    private function onBootstrapSessionIPv4($Request)
    {
        $RemoteAddr = $Request->getServer()->get('HTTP_X_REAL_IP');
        $RemoteAddr = ($RemoteAddr == null) ? $Request->getServer()->get('REMOTE_ADDR') : $RemoteAddr;
        return $RemoteAddr;
    }

    public function getServiceConfig()
    {
        return [
            'factories' => [
                'Mailer' => function (ContainerInterface $ServiceManager) {
                    $Config = $ServiceManager->get('Config');
                    $Config = $Config['smtp'];
                    $PHPMailer = new PHPMailer(true);
                    $PHPMailer->isSMTP();
                    $PHPMailer->isHTML(true);
                    $PHPMailer->Host = $Config['host'];
                    $PHPMailer->Port = $Config['port'];
                    $PHPMailer->SMTPAuth = $Config['auth'];
                    $PHPMailer->Username = $Config['username'];
                    $PHPMailer->Password = $Config['password'];
                    $PHPMailer->SMTPSecure = $Config['security'];
                    $PHPMailer->setFrom($Config['from']['mail'], $Config['from']['name']);
                    $PHPMailer->addReplyTo($Config['from']['mail'], $Config['from']['name']);
                    $PHPMailer->CharSet = "UTF-8";
                    $PHPMailer->XMailer = 'Reebok Sports Club';
                    return $PHPMailer;
                },
                'Database\Gateway' => function (ContainerInterface $ContainerInterface) {
                    $AdapterInterface = $ContainerInterface->get(AdapterInterface::class);
                    return new TableGateway('', $AdapterInterface);
                }
            ]
        ];
    }

    public function getConfig()
    {
        return include __DIR__ . '/../config/config.php';
    }
}
