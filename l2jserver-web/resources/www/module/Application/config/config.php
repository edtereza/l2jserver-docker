<?php
namespace Application;

use Interop\Container\ContainerInterface;
use Zend\Router\Http\Literal;
use Zend\Router\Http\Segment;
return [
    'router' => [
        'routes' => [
            'manifest' => [
                'type' => Literal::class,
                'options' => [
                    'route' => '/manifest.json',
                    'defaults' => [
                        'controller' => Controller\ManifestController::class,
                        'action' => 'manifest'
                    ]
                ],
                'may_terminate' => true
            ],
            'splash' => [
                'type' => Literal::class,
                'options' => [
                    'route' => '/',
                    'defaults' => [
                        'controller' => Controller\SplashController::class,
                        'action' => 'splash'
                    ]
                ],
                'may_terminate' => true
            ],
            'resume' => [
                'type' => Literal::class,
                'options' => [
                    'route' => '/resume',
                    'defaults' => [
                        'controller' => Controller\SessionController::class,
                        'action' => 'resume'
                    ]
                ],
                'may_terminate' => true
            ],
            'token' => [
                'type' => Literal::class,
                'options' => [
                    'route' => '/token',
                    'defaults' => [
                        'controller' => Controller\SessionController::class,
                        'action' => 'token'
                    ]
                ],
                'may_terminate' => true
            ],
            'login' => [
                'type' => Literal::class,
                'options' => [
                    'route' => '/login',
                    'defaults' => [
                        'controller' => Controller\AuthenticationController::class,
                        'action' => 'login',
                        'event' => null
                    ]
                ],
                'may_terminate' => true
            ],
            'logout' => [
                'type' => Literal::class,
                'options' => [
                    'route' => '/logout',
                    'defaults' => [
                        'controller' => Controller\AuthenticationController::class,
                        'action' => 'logout'
                    ]
                ],
                'may_terminate' => true
            ],
            'signup' => [
                'type' => Literal::class,
                'options' => [
                    'route' => '/signup',
                    'defaults' => [
                        'controller' => Controller\AuthenticationController::class,
                        'action' => 'signup'
                    ]
                ],
                'may_terminate' => true
            ],
            'password-recover' => [
                'type' => Literal::class,
                'options' => [
                    'route' => '/password-recover',
                    'defaults' => [
                        'controller' => Controller\AuthenticationController::class,
                        'action' => 'passwordRecover'
                    ]
                ],
                'may_terminate' => true
            ],
            'linked-account' => [
                'type' => Literal::class,
                'options' => [
                    'route' => '/linked-account',
                    'defaults' => [
                        'controller' => Controller\AuthenticationController::class,
                        'action' => 'linkedAccount'
                    ]
                ],
                'may_terminate' => true
            ],
            'form' => [
                'type' => Literal::class,
                'options' => [
                    'route' => '/form',
                    'defaults' => [
                        'controller' => Controller\FormController::class,
                        'action' => 'form'
                    ]
                ],
                'may_terminate' => true,
                'child_routes' => [
                    'form' => [
                        'type' => Segment::class,
                        'options' => [
                            'route' => '/[:form_id]',
                            'defaults' => [
                                'controller' => Controller\FormController::class,
                                'action' => 'form'
                            ]
                        ]
                    ]
                ]
            ],
            'lgpd' => [
                'type' => Literal::class,
                'options' => [
                    'route' => '/lgpd',
                    'defaults' => [
                        'controller' => Controller\LGPDController::class,
                        'action' => 'lgpd'
                    ]
                ],
                'may_terminate' => true,
                'child_routes' => [
                    'biometric' => [
                        'type' => Literal::class,
                        'options' => [
                            'route' => '/biometric',
                            'defaults' => [
                                'controller' => Controller\LGPDController::class,
                                'action' => 'biometric'
                            ]
                        ],
                        'may_terminate' => true,
                        'child_routes' => [
                            'settings' => [
                                'type' => Literal::class,
                                'options' => [
                                    'route' => '/settings',
                                    'defaults' => [
                                        'controller' => Controller\LGPDController::class,
                                        'action' => 'biometricSettings'
                                    ]
                                ],
                                'may_terminate' => true
                            ]
                        ]
                    ]
                ]
            ],
            'terms' => [
                'type' => Literal::class,
                'options' => [
                    'route' => '/terms',
                    'defaults' => [
                        'controller' => Controller\AuthenticationController::class,
                        'action' => 'terms'
                    ]
                ],
                'may_terminate' => true,
                'child_routes' => [
                    'usage' => [
                        'type' => Literal::class,
                        'options' => [
                            'route' => '/usage',
                            'defaults' => [
                                'controller' => Controller\AuthenticationController::class,
                                'action' => 'terms',
                                'display' => 'usage'
                            ]
                        ],
                        'may_terminate' => true
                    ],
                    'privacy' => [
                        'type' => Literal::class,
                        'options' => [
                            'route' => '/privacy',
                            'defaults' => [
                                'controller' => Controller\AuthenticationController::class,
                                'action' => 'terms',
                                'display' => 'privacy'
                            ]
                        ],
                        'may_terminate' => true
                    ]
                ]
            ],
            'menu' => [
                'type' => Literal::class,
                'options' => [
                    'route' => '/menu',
                    'defaults' => [
                        'controller' => Controller\MenuController::class,
                        'action' => 'menu'
                    ]
                ],
                'may_terminate' => true,
                'child_routes' => [
                    'main' => [
                        'type' => Literal::class,
                        'options' => [
                            'route' => '/main',
                            'defaults' => [
                                'controller' => Controller\MenuController::class,
                                'action' => 'main'
                            ]
                        ],
                        'may_terminate' => true
                    ],
                    'filter' => [
                        'type' => Literal::class,
                        'options' => [
                            'route' => '/filter',
                            'defaults' => [
                                'controller' => Controller\MenuController::class,
                                'action' => 'filter'
                            ]
                        ],
                        'may_terminate' => true
                    ]
                ]
            ],
            'home' => [
                'type' => Literal::class,
                'options' => [
                    'route' => '/home',
                    'defaults' => [
                        'controller' => Controller\HomeController::class,
                        'action' => 'home',
                        'event' => null
                    ]
                ],
                'may_terminate' => true,
                'child_routes' => [
                    'qrcode' => [
                        'type' => Literal::class,
                        'options' => [
                            'route' => '/qrcode',
                            'defaults' => [
                                'controller' => Controller\HomeController::class,
                                'action' => 'homeQRCode'
                            ]
                        ],
                        'may_terminate' => true
                    ]
                ]
            ],
            'settings' => [
                'type' => Literal::class,
                'options' => [
                    'route' => '/settings',
                    'defaults' => [
                        'controller' => Controller\SettingsController::class,
                        'action' => 'settings'
                    ]
                ],
                'may_terminate' => true,
                'child_routes' => [
                    'privacy' => [
                        'type' => Literal::class,
                        'options' => [
                            'route' => '/privacy',
                            'defaults' => [
                                'controller' => Controller\SettingsController::class,
                                'action' => 'settingsPrivacy'
                            ]
                        ],
                        'may_terminate' => true
                    ],
                    'profile' => [
                        'type' => Literal::class,
                        'options' => [
                            'route' => '/profile',
                            'defaults' => [
                                'controller' => Controller\SettingsController::class,
                                'action' => 'settingsProfile'
                            ]
                        ],
                        'may_terminate' => true
                    ],
                    'biometric' => [
                        'type' => Literal::class,
                        'options' => [
                            'route' => '/biometric',
                            'defaults' => [
                                'controller' => Controller\SettingsController::class,
                                'action' => 'settingsBiometric'
                            ]
                        ],
                        'may_terminate' => true
                    ],
                    'notification' => [
                        'type' => Literal::class,
                        'options' => [
                            'route' => '/notification',
                            'defaults' => [
                                'controller' => Controller\SettingsController::class,
                                'action' => 'settingsNotification'
                            ]
                        ],
                        'may_terminate' => true
                    ],
                    'plan' => [
                        'type' => Literal::class,
                        'options' => [
                            'route' => '/plan',
                            'defaults' => [
                                'controller' => Controller\SettingsController::class,
                                'action' => 'settingsPlan'
                            ]
                        ],
                        'may_terminate' => true
                    ]
                ]
            ],
            'profile' => [
                'type' => Literal::class,
                'options' => [
                    'route' => '/profile',
                    'defaults' => [
                        'controller' => Controller\ProfileController::class,
                        'action' => 'profile'
                    ]
                ],
                'may_terminate' => true,
                'child_routes' => [
                    'nickname' => [
                        'type' => Literal::class,
                        'options' => [
                            'route' => '/nickname',
                            'defaults' => [
                                'controller' => Controller\ProfileController::class,
                                'action' => 'profileNickname'
                            ]
                        ],
                        'may_terminate' => true
                    ],
                    'metric' => [
                        'type' => Literal::class,
                        'options' => [
                            'route' => '/metric',
                            'defaults' => [
                                'controller' => Controller\ProfileController::class,
                                'action' => 'profileMetric'
                            ]
                        ],
                        'may_terminate' => true,
                        'child_routes' => [
                            'weight' => [
                                'type' => Literal::class,
                                'options' => [
                                    'route' => '/weight',
                                    'defaults' => [
                                        'controller' => Controller\ProfileController::class,
                                        'action' => 'profileMetricWeight'
                                    ]
                                ],
                                'may_terminate' => true
                            ],
                            'height' => [
                                'type' => Literal::class,
                                'options' => [
                                    'route' => '/height',
                                    'defaults' => [
                                        'controller' => Controller\ProfileController::class,
                                        'action' => 'profileMetricHeight'
                                    ]
                                ],
                                'may_terminate' => true
                            ]
                        ]
                    ]
                ]
            ],
            'activity' => [
                'type' => Literal::class,
                'options' => [
                    'route' => '/activity',
                    'defaults' => [
                        'controller' => Controller\ActivityController::class,
                        'action' => 'activity'
                    ]
                ],
                'may_terminate' => true,
                'child_routes' => [
                    'live' => [
                        'type' => Segment::class,
                        'options' => [
                            'route' => '/live/[:base64]',
                            'defaults' => [
                                'controller' => Controller\ActivityController::class,
                                'action' => 'activityLive'
                            ]
                        ],
                        'may_terminate' => true
                    ],
                    'filter' => [
                        'type' => Literal::class,
                        'options' => [
                            'route' => '/display',
                            'defaults' => [
                                'controller' => Controller\ActivityController::class,
                                'action' => 'activityFilter'
                            ]
                        ],
                        'may_terminate' => true
                    ],
                    'display' => [
                        'type' => Literal::class,
                        'options' => [
                            'route' => '/display',
                            'defaults' => [
                                'controller' => Controller\ActivityController::class,
                                'action' => 'activityDisplay'
                            ]
                        ],
                        'may_terminate' => true
                    ],
                    'detail' => [
                        'type' => Segment::class,
                        'options' => [
                            'route' => '/detail/[:area]/[:class]/[:year]/[:month]/[:day]/[:hour]/[:minute]',
                            'defaults' => [
                                'controller' => Controller\ActivityController::class,
                                'action' => 'activityDetail'
                            ]
                        ],
                        'may_terminate' => true,
                        'child_routes' => [
                            'live' => [
                                'type' => Literal::class,
                                'options' => [
                                    'route' => '/live',
                                    'defaults' => [
                                        'controller' => Controller\ActivityController::class,
                                        'action' => 'activityDetailLive'
                                    ]
                                ],
                                'may_terminate' => true,
                                'child_routes' => [
                                    'window' => [
                                        'type' => Literal::class,
                                        'options' => [
                                            'route' => '/window',
                                            'defaults' => [
                                                'controller' => Controller\ActivityController::class,
                                                'action' => 'activityDetailLiveWindow'
                                            ]
                                        ],
                                        'may_terminate' => true
                                    ]
                                ]
                            ]
                        ]
                    ],
                    'booking' => [
                        'type' => Segment::class,
                        'options' => [
                            'route' => '/detail/[:area]/[:class]/[:year]/[:month]/[:day]/[:hour]/[:minute]/booking',
                            'defaults' => [
                                'controller' => Controller\ActivityController::class,
                                'action' => 'activityBooking'
                            ]
                        ],
                        'may_terminate' => true
                    ]
                ]
            ],
            'coach' => [
                'type' => Segment::class,
                'options' => [
                    'route' => '/coach/[:coach]',
                    'defaults' => [
                        'controller' => Controller\CoachController::class,
                        'action' => 'coach'
                    ]
                ],
                'may_terminate' => true,
                'child_routes' => [
                    'photo' => [
                        'type' => Literal::class,
                        'options' => [
                            'route' => '/photo',
                            'defaults' => [
                                'controller' => Controller\CoachController::class,
                                'action' => 'coachPhoto'
                            ]
                        ],
                        'may_terminate' => true
                    ]
                ]
            ]
        ]
    ],
    'controllers' => [
        'factories' => [
            Controller\ApplicationController::class => function (ContainerInterface $ContainerInterface) {
                return new Controller\ApplicationController($ContainerInterface);
            },
            Controller\ManifestController::class => function (ContainerInterface $ContainerInterface) {
                return new Controller\ManifestController($ContainerInterface);
            },
            Controller\SplashController::class => function (ContainerInterface $ContainerInterface) {
                return new Controller\SplashController($ContainerInterface);
            },
            Controller\SessionController::class => function (ContainerInterface $ContainerInterface) {
                return new Controller\SessionController($ContainerInterface);
            },
            Controller\AuthenticationController::class => function (ContainerInterface $ContainerInterface) {
                return new Controller\AuthenticationController($ContainerInterface);
            },
            Controller\MenuController::class => function (ContainerInterface $ContainerInterface) {
                return new Controller\MenuController($ContainerInterface);
            },
            Controller\HomeController::class => function (ContainerInterface $ContainerInterface) {
                return new Controller\HomeController($ContainerInterface);
            },
            Controller\ProfileController::class => function (ContainerInterface $ContainerInterface) {
                return new Controller\ProfileController($ContainerInterface);
            },
            Controller\SettingsController::class => function (ContainerInterface $ContainerInterface) {
                return new Controller\SettingsController($ContainerInterface);
            },
            Controller\ActivityController::class => function (ContainerInterface $ContainerInterface) {
                return new Controller\ActivityController($ContainerInterface);
            },
            Controller\CoachController::class => function (ContainerInterface $ContainerInterface) {
                return new Controller\CoachController($ContainerInterface);
            },
            Controller\FormController::class => function (ContainerInterface $ContainerInterface) {
                return new Controller\FormController($ContainerInterface);
            },
            Controller\LGPDController::class => function (ContainerInterface $ContainerInterface) {
                return new Controller\LGPDController($ContainerInterface);
            }
        ]
    ],
    'view_helpers' => [],
    'view_manager' => [
        'doctype' => 'HTML5',
        'display_not_found_reason' => true,
        'display_exceptions' => true,
        'not_found_template' => 'error/404',
        'exception_template' => 'error/index',
        'template_map' => [
            'layout/layout' => __DIR__ . '/../view/application/layout.phtml',
            'application/index/index' => __DIR__ . '/../view/application/index/index.phtml',
            'error/404' => __DIR__ . '/../view/error/404.phtml',
            'error/index' => __DIR__ . '/../view/error/index.phtml'
        ],
        'template_path_stack' => [
            __DIR__ . '/../view'
        ],
        'strategies' => [
            'ViewJsonStrategy'
        ]
    ]
];
