<?php
namespace Application\Controller;

use Interop\Container\ContainerInterface;
use Zend\View\Model\ViewModel;
use Zend\View\Model\JsonModel;

class ActivityController extends ApplicationController
{

    public function __construct(ContainerInterface $ContainerInterface)
    {
        parent::__construct($ContainerInterface);
    }

    public function activityAction()
    {
        if (! $this->isAjax()) {
            return $this->goTo('splash');
        } else {
            if (! $this->isLoguedIn()) {
                $ViewModel = new ViewModel();
                $ViewModel->setTemplate('application/authentication/logout');
                echo $this->ContainerInterface->get('ViewRenderer')->render($ViewModel);
                return $this->getResponse();
            } else {
                $ViewModel = new ViewModel();
                $ViewModel->setTemplate('application/activity/home');
                echo $this->ContainerInterface->get('ViewRenderer')->render($ViewModel);
                return $this->getResponse();
            }
        }
    }
    
    public function activityLiveAction()
    {
        if (! $this->isAjax()) {
            $base64 = $this->params()->fromRoute('base64');
            $base64 = base64_decode($base64);
            $base64 = base64_decode($base64);
            $jsonData = json_decode($base64,true);
            $this->setRedirect($this->url()->fromRoute('activity/detail/live', [
                'area' => $jsonData['area'],
                'class' => $jsonData['dbid'],
                'year' => date('Y',strtotime($jsonData['date'])),
                'month' => date('m',strtotime($jsonData['date'])),
                'day' => date('d',strtotime($jsonData['date'])),
                'hour' => explode(':',$jsonData['hour'])[0],
                'minute' => explode(':',$jsonData['hour'])[1]
            ]));
            return $this->goTo('splash');
        } else {
            $Area = $this->params()->fromRoute('area');
            $Class = $this->params()->fromRoute('class');
            $Year = $this->params()->fromRoute('year');
            $Month = $this->params()->fromRoute('month');
            $Day = $this->params()->fromRoute('day');
            $Hour = $this->params()->fromRoute('hour');
            $Minute = $this->params()->fromRoute('minute');
            $Params = [
                'area' => $Area,
                'class' => $Class,
                'date' => $Year . '-' . $Month . '-' . $Day,
                'hour' => $Hour . ':' . $Minute
            ];
            $Person = $this->getPerson();
            $Activity = $this->requestData('activity', 'POST', $Params);
            $ViewModel = new ViewModel([
                'Person' => $Person,
                'Activity' => $Activity
            ]);
            $ViewModel->setTemplate('application/activity/detail-zoom');
        }
        echo $this->ContainerInterface->get('ViewRenderer')->render($ViewModel);
        return $this->getResponse();
    }

    public function activityDisplayAction()
    {
        if (! $this->isAjax()) {
            
            return $this->goTo('splash');
        } else {
            $Params = [
                'location' => $this->getParam('location'),
                'area' => $this->getParam('area'),
                'modality' => $this->getParam('modality'),
                'class' => $this->getParam('class'),
                'audience' => $this->getParam('audience'),
                'week_day' => $this->getParam('week_day'),
                'day_time' => $this->getParam('day_time')
            ];

            $Activity = $this->requestData('activity/weekly', 'POST', $Params);
            $ViewModel = new ViewModel([
                'Activity' => $Activity
            ]);
            $Display = $this->getParam('display');
            $Display = ($Display == null ? 'LOCATION' : strtoupper($Display));
            switch ($Display) {
                case 'FULL':
                    $ViewModel->setTemplate('application/activity/display-full');
                    break;
                case 'DATE':
                    $ViewModel->setTemplate('application/activity/display-date');
                    break;
            }
            echo $this->ContainerInterface->get('ViewRenderer')->render($ViewModel);
            return $this->getResponse();
        }
    }

    public function activityDetailAction()
    {
        if (! $this->isAjax()) {
            $Area = $this->params()->fromRoute('area');
            $Class = $this->params()->fromRoute('class');
            $Year = $this->params()->fromRoute('year');
            $Month = $this->params()->fromRoute('month');
            $Day = $this->params()->fromRoute('day');
            $Hour = $this->params()->fromRoute('hour');
            $Minute = $this->params()->fromRoute('minute');
            $this->setRedirect($this->url()->fromRoute('activity/detail', [
                'area' => $Area,
                'class' => $Class,
                'year' => $Year,
                'month' => $Month,
                'day' => $Day,
                'hour' => $Hour,
                'minute' => $Minute
            ]));
            return $this->goTo('splash');
        } else {
            $Area = $this->params()->fromRoute('area');
            $Class = $this->params()->fromRoute('class');
            $Year = $this->params()->fromRoute('year');
            $Month = $this->params()->fromRoute('month');
            $Day = $this->params()->fromRoute('day');
            $Hour = $this->params()->fromRoute('hour');
            $Minute = $this->params()->fromRoute('minute');
            $Params = [
                'area' => $Area,
                'class' => $Class,
                'date' => $Year . '-' . $Month . '-' . $Day,
                'hour' => $Hour . ':' . $Minute
            ];
            $Person = $this->getPerson();
            $Activity = $this->requestData('activity', 'POST', $Params);
            $ViewModel = new ViewModel([
                'Person' => $Person,
                'Activity' => $Activity
            ]);
            $ViewModel->setTemplate('application/activity/detail');
        }
        echo $this->ContainerInterface->get('ViewRenderer')->render($ViewModel);
        return $this->getResponse();
    }
    
    public function activityDetailLiveAction()
    {
        if (! $this->isAjax()) {
            $Area = $this->params()->fromRoute('area');
            $Class = $this->params()->fromRoute('class');
            $Year = $this->params()->fromRoute('year');
            $Month = $this->params()->fromRoute('month');
            $Day = $this->params()->fromRoute('day');
            $Hour = $this->params()->fromRoute('hour');
            $Minute = $this->params()->fromRoute('minute');
            $this->setRedirect($this->url()->fromRoute('activity/detail/live', [
                'area' => $Area,
                'class' => $Class,
                'year' => $Year,
                'month' => $Month,
                'day' => $Day,
                'hour' => $Hour,
                'minute' => $Minute
            ]));
            return $this->goTo('splash');
        } else {
            $Area = $this->params()->fromRoute('area');
            $Class = $this->params()->fromRoute('class');
            $Year = $this->params()->fromRoute('year');
            $Month = $this->params()->fromRoute('month');
            $Day = $this->params()->fromRoute('day');
            $Hour = $this->params()->fromRoute('hour');
            $Minute = $this->params()->fromRoute('minute');
            $Params = [
                'area' => $Area,
                'class' => $Class,
                'date' => $Year . '-' . $Month . '-' . $Day,
                'hour' => $Hour . ':' . $Minute
            ];
            $Person = $this->getPerson();
            $Activity = $this->requestData('activity', 'POST', $Params);
            $ViewModel = new ViewModel([
                'Person' => $Person,
                'Activity' => $Activity
            ]);
            $ViewModel->setTemplate('application/activity/detail-zoom');
        }
        echo $this->ContainerInterface->get('ViewRenderer')->render($ViewModel);
        return $this->getResponse();
    }
    
    public function activityDetailLiveWindowAction()
    {
        $Mobile = new \Mobile_Detect();
        $Area = $this->params()->fromRoute('area');
        $Class = $this->params()->fromRoute('class');
        $Year = $this->params()->fromRoute('year');
        $Month = $this->params()->fromRoute('month');
        $Day = $this->params()->fromRoute('day');
        $Hour = $this->params()->fromRoute('hour');
        $Minute = $this->params()->fromRoute('minute');
        $Params = [
            'area' => $Area,
            'class' => $Class,
            'date' => $Year . '-' . $Month . '-' . $Day,
            'hour' => $Hour . ':' . $Minute
        ];
        $this->requestData('activity/presence', 'POST', $Params);
        $Activity = $this->requestData('activity', 'POST', $Params);
        if ($Mobile->isMobile())
            return $this->goToExternal($Activity['zoom']['link']);
        else
            return $this->goToExternal('https://zoom.us/wc/' . $Activity['zoom']['dbid'] . '/join?pwd=' . $Activity['zoom']['password']);
        //return $this->getResponse();
    }

    public function activityBookingAction()
    {
        if (! $this->isAjax()) {
            return $this->goTo('splash');
        } else {
            $Area = $this->params()->fromRoute('area');
            $Class = $this->params()->fromRoute('class');
            $Year = $this->params()->fromRoute('year');
            $Month = $this->params()->fromRoute('month');
            $Day = $this->params()->fromRoute('day');
            $Hour = $this->params()->fromRoute('hour');
            $Minute = $this->params()->fromRoute('minute');
            $Object = $this->getParam('object');
            $Number = $this->getParam('number');
            $Booking = ($this->getParam('booking') == 1 ? true : false);
            $Confirm = ($this->getParam('event') == 'confirm' ? true : false);
            $Params = [
                'area' => $Area,
                'class' => $Class,
                'date' => $Year . '-' . $Month . '-' . $Day,
                'hour' => $Hour . ':' . $Minute,
                "object" => $Object,
                "number" => $Number
            ];
            $Response = [
                'dbid' => 999,
                'slug' => 'INVALID',
                'resume' => 'Erro Interno',
                'detail' => 'Houve um erro interno ao tentar executar esta ação.<br/><br/>Tente novamente...'
            ];
            if ($Booking == true && $Confirm == false) {
                $Response = $this->requestData('activity/booking', 'POST', $Params);
            } elseif ($Booking == true && $Confirm == true) {
                $Response = $this->requestData('activity/booking/confirm', 'POST', $Params);
            } else {
                $Response = $this->requestData('activity/booking/cancel', 'POST', $Params);
            }
            if ($Response == null)
                $Response = [
                    'dbid' => 999,
                    'slug' => 'INVALID',
                    'resume' => 'Erro Interno',
                    'detail' => 'Houve um erro interno ao tentar executar esta ação.<br/><br/>Tente novamente...'
                ];
            return new JsonModel($Response);
        }
    }
}