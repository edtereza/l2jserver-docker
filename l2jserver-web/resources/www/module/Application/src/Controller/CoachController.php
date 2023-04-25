<?php
namespace Application\Controller;

use Interop\Container\ContainerInterface;

class CoachController extends ApplicationController
{

    public function __construct(ContainerInterface $ContainerInterface)
    {
        parent::__construct($ContainerInterface);
    }

    public function coachPhotoAction()
    {
        $Coach = $this->params()->fromRoute('coach');
        $Params = [
            'photo' => true,
            'coach' => intval($Coach)
        ];
        $Photo = $this->getCache($Params, 3600);
        if ($Photo == null) {
            $Photo = $this->requestData('coach/photo', 'POST', $Params);
            if ($Photo !== null && isset($Photo['size']))
                $this->setCache($Photo, $Params);
        }
        if ($Photo != null) {
            $this->getResponse()
                ->getHeaders()
                ->addHeaderLine('Content-type', $Photo['mimetype'], true);
            echo base64_decode($Photo['data']);
        } else {
            $this->delCache($Params);
        }
        return $this->getResponse();
    }
}