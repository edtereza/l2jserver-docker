<?php
namespace Application\Controller;

use Interop\Container\ContainerInterface;

class SplashController extends ApplicationController
{

    public function __construct(ContainerInterface $ContainerInterface)
    {
        parent::__construct($ContainerInterface);
    }

    public function splashAction()
    {}
}