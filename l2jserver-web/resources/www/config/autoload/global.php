<?php
/**
 * Global Configuration Override
 *
 * You can use this file for overriding configuration values from modules, etc.
 * You would place values in here that are agnostic to the environment and not
 * sensitive to security.
 *
 * @NOTE: In practice, this file will typically be INCLUDED in your source
 * control, so do not include passwords or other sensitive information in this
 * file.
 */

return [
    'db' => [
        'driver' => 'Pdo',
        'dsn' => 'dblib:host=PRODUCAO;dbname=BasicgymProd;',
        'username' => 'usrBasicgymIntranet',
        'password' => 'pW=}t++?z4WBgE^U',
        'charset' => 'UTF-8'
    ],
    'smtp' => [
        'host' => 'smtp-ha.skymail.net.br',
        'port' => 587,
        'auth' => true,
        'from' => [
            'name' => 'Reebok Sports Club',
            'mail' => 'noreply@reebokclub.com.br',
        ],
        'security' => null,
        'username' => 'noreply@reebokclub.com.br',
        'password' => 'polswe',
    ],
    'service_manager' => [
        'factories' => [
            
        ]
    ],
    'session_config' => [
        //:: Cookies expiram em 24 horas
        'cookie_lifetime' => 60 * 60 * 24,
        //:: Armazenamento no servidor por 7 dias
        'gc_maxlifetime' => 60 * 60 * 24,
    ],
    'session_manager' => [
        'validators' => [
            'Zend\Session\Validator\RemoteAddr',
            'Zend\Session\Validator\HttpUserAgent'
        ]
    ],
    'session_storage' => [
        'type' => 'Zend\Session\Storage\SessionArrayStorage'
    ],
];