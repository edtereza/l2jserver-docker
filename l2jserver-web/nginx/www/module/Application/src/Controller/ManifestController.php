<?php
namespace Application\Controller;

use Zend\View\Model\JsonModel;

class ManifestController extends ApplicationController
{

    private $version = 2;

    private $version_string = '1.2.26';

    public function manifestAction()
    {
        return new JsonModel([
            "dir" => "auto",
            "lang" => "pt-br",
            "name" => "Reebok Sports Club",
            "short_name" => "Reebok Sports Club",
            "description" => "Seu aplicativo web para reservar suas aulas e acompanhamento de desempenho, uma melhor experiência para você aluno Reebok Sports Club.",
            "icons" => [
                [
                    "src" => $this->getRequest()->getBaseUrl() . "assets/favicons/android-chrome-36x36.png",
                    "sizes" => "36x36",
                    "type" => "image/png",
                    "density" => 0.75
                ],
                [
                    "src" => $this->getRequest()->getBaseUrl() . "assets/favicons/android-chrome-48x48.png",
                    "sizes" => "48x48",
                    "type" => "image/png",
                    "density" => 1.0
                ],
                [
                    "src" => $this->getRequest()->getBaseUrl() . "assets/favicons/android-chrome-72x72.png",
                    "sizes" => "72x72",
                    "type" => "image/png",
                    "density" => 1.5
                ],
                [
                    "src" => $this->getRequest()->getBaseUrl() . "assets/favicons/android-chrome-96x96.png",
                    "sizes" => "96x96",
                    "type" => "image/png",
                    "density" => 2
                ],
                [
                    "src" => $this->getRequest()->getBaseUrl() . "assets/favicons/android-chrome-144x144.png",
                    "sizes" => "144x144",
                    "type" => "image/png",
                    "density" => 3
                ],
                [
                    "src" => $this->getRequest()->getBaseUrl() . "assets/favicons/android-chrome-192x192.png",
                    "sizes" => "192x192",
                    "type" => "image/png",
                    "density" => 4
                ]
            ],
            "start_url" => "https://mobile.reebokclub.com.br",
            "display" => "standalone",
            "version" => $this->version_string,
            "manifest_version" => $this->version,
            "theme_color" => '#d9534f',
            "background_color" => '#ffffff',
            "gcm_sender_id" => 195531984432
        ]);
    }
}
