'use strict';
(function() {
	/*
	|------------------------------------------------------------------------------
	| Validando Browser :: Safari
	|------------------------------------------------------------------------------
	*/
	var _isSafari = false;
	try {
		var ua = navigator.userAgent.toLowerCase(); 
		if (ua.indexOf('safari') != -1) { 
			if (ua.indexOf('chrome') > -1) {
				_isSafari = false;
			} else {
				_isSafari = true;
			}
		}
		else {
			_isSafari = false;
		} 
	}
	catch (_exception) {
		console.log(_exception);
	}	
	/*
	|------------------------------------------------------------------------------
	| Inicializando Framework7-v1
	|------------------------------------------------------------------------------
	*/
	window.cfgReebok = {
		id: 'br.com.basicgym.intranet',
		name: 'Reebok Sports Club',
		root: 'body',
		cache: false,
		init: false,
		material: true,
		modalTitle: 'Reebok Sports Club',
		notificationCloseButtonText: 'OK',
		scrollTopOnNavbarClick: true,
		panel: {
			swipe: 'left',
		},
		smartSelectOpenIn: 'popup',
        smartSelectBackText: 'Voltar',
        smartSelectPopupCloseText: 'Fechar',
        smartSelectPickerCloseText: 'Ok',
	};
	if (_isSafari == false) {
		window.cfgReebok.material = true;
	}	
	window.appReebok = new Framework7(window.cfgReebok);
	/*
	|------------------------------------------------------------------------------
	| Inicializando variáveis base
	|------------------------------------------------------------------------------
	*/
	window.appReebok.fullPath = '';
	window.appReebok.basePath = '';
	window.appReebok.enableIndicator = false;
	window.appReebok.enableProgressbar = false;
	try {
		if (window.location.pathname.split('/')[1] != undefined && window.location.pathname.split('/')[1] != '') {
			window.appReebok.basePath = '/' + window.location.pathname.split('/')[1];
			window.appReebok.basePath.replace('//','/');
		}
	}
	catch (_exception) {
		console.log(_exception);
	}
	window.appReebok.basePath = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '') + window.appReebok.basePath;
	/*
	|------------------------------------------------------------------------------
	| Inicializando dados do dispositivo
	|------------------------------------------------------------------------------
	*/	
	window.appReebok.Device = {
		UUID: undefined,
		IPv4: undefined,
		Resumed: false,
	};
	/*
	|------------------------------------------------------------------------------
	| Inicializando funções básicas
	|------------------------------------------------------------------------------
	*/	
	window.appReebok.SW = {
		Register: function() {
			return;
			if ('serviceWorker' in navigator) {
				window.addEventListener('load', function() {
					navigator.serviceWorker.register(appReebok.basePath + '/service-worker.js').then(function(_serviceWorkerRegistration) {
						_serviceWorkerRegistration.onupdatefound = function() {
							var _serviceWorkerInstalling = _serviceWorkerRegistration.installing;
								_serviceWorkerInstalling.onstatechange = function() {
									console.log(_serviceWorkerInstalling.state);
									if(_serviceWorkerInstalling.state === 'installed' && navigator.serviceWorker.controller){
										window.location.reload();
									} else if (_serviceWorkerInstalling.state === 'installed'){
										window.location.reload();
									}
								};
						}
				    }).catch(function(_exception) {
				    	console.log(_exception);
					});
					navigator.serviceWorker.addEventListener('message', function(Event) {
						var Data = Event.data;
						if(Data !== undefined && Data.action !== undefined) {
							switch(Data.action) {
								case 'refresh':
									appReebok.Refresh();
									break;
							}
						}
					});
				});
			} else {
				console.log("'serviceWorker' is missing");
			};
		},
		Message: function(Data) {
			console.log(Data);
			try {
				Data.debug = true;
				Data.cache = {
					wipe: true,
				}
				if (navigator.serviceWorker.controller != null && navigator.serviceWorker.controller != undefined) {
					return new Promise(function(resolve, reject){
						var MessageChannel = new MessageChannel();
							MessageChannel.port1.onmessage = function(Event){
								if(Event.data.error){
									reject(Event.data.error);
								} else {
									resolve(Event.data);
								}
							};
				        navigator.serviceWorker.controller.postMessage(Data, [MessageChannel.port2]);
				    });
				}
			} catch(Exception) {
				console.log(Exception);
			}
		}
	}
	//######
	window.appReebok.Menu = {
		Main: function() {
			var _menuMainURL = window.appReebok.basePath + '/menu/main';
			var _menuMainHolder = $('body .panel-left');
			if (_menuMainHolder.length == 0) {
				 $('body').append('<div class="panel panel-left panel-reveal"></div>');
				 _menuMainHolder = $('body .panel-left');
			}
			if (_menuMainHolder.length != 0) {
				$.ajax({
			        url: _menuMainURL,
			        type: 'POST',
			        error : function(xhr, ajaxOptions, thrownError) { 
			        	if (thrownError == 'abort') return;
			        	setTimeout(function(){
			        		appReebok.Menu.Main();
			        	}, 1000);
			        },
			        success : function(data, textStatus, jqXHR) {
		        		$('body .panel-left').data('loaded', true);
		        		$('body .panel-left').html(data);
			        }
			    });	
			}
		},
	} 
	// ######
	window.appReebok.Logout = function() {
		window.location.href = window.appReebok.basePath;
	};
	// ######
	window.appReebok.OnBack = function() {
		
	}
	// ######
	window.appReebok.Back = function() {
		mainView.router.back();	
	}
	// ######
	window.appReebok.Refresh = function() {
		window.location.reload();
	}
	// ######
	window.appReebok.Reload = function() {
		mainView.router.refreshPage()
	};
	// ######
	window.appReebok.Load = function(Options) {
		if (Options !== undefined && Options.url !== undefined) {
			mainView.router.load(Options);
		}
	};
	// ######
	window.appReebok.Resume = function (Options) {
		if (appReebok.Device.Resumed || (Options != undefined && Options.force == true)) 
			return;
		appReebok.Device.Resumed = true;
		$.ajax({
	        url : window.appReebok.basePath + '/resume',
	        type : 'POST',
	        data : {
	        	uuid: appReebok.Device.UUID,
	        	ipv4: appReebok.Device.IPv4,
	        },
	        error : function(xhr, ajaxOptions, thrownError) {
	        	appReebok.Device.Resumed = false;
	        	if (Options !== undefined && typeof Options.onError === 'function') {
	            	try {
	            		Options.onError.apply(this, [xhr, ajaxOptions, thrownError]);	
	            	}
	        		catch(_exception){
	        			console.log(_exception);
	        		}
	            }
	        },
	        success : function(data, textStatus, jqXHR) {
				appReebok.Device.Resumed = true;
				var _goTo = data.goto;
				if (_goTo !== undefined) {
					appReebok.Load({
						url: _goTo
					});
					setTimeout(function(){
						appReebok.enableIndicator = true;
						appReebok.enableProgressbar = true;
					},1000);
				} else {
					
				}
	        	if (Options !== undefined && typeof Options.onSuccess === 'function') {
	            	try {
	            		Options.onSuccess.apply(this, [data, textStatus, jqXHR]);	
	            	}
	        		catch(_exception){
	        			console.log(_exception);
	        		}
	            }
	        }
	    });	
	};
	// ######
	window.appReebok.Processing = {
		Show: function (){
			appReebok.showIndicator();
	    	var progressContainer = $$('body');
	        if (progressContainer.children('.progressbar, .progressbar-infinite').length) {
	        	return; 
	        }
	        appReebok.showProgressbar(progressContainer, 'reebok');
		},
		Hide: function () {
			appReebok.hideIndicator();	
			appReebok.hideProgressbar();	
		}
	};
	// ######
	window.appReebok.RandomString = function(Length, UseAlphaNumeric) {
		var AlphaNumeric = (UseAlphaNumeric == undefined ? "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("") : UseAlphaNumeric.split(""));
		var ArrayStorage = [];  
		for (var Looping = 0; Looping < Length; Looping++) {
		    ArrayStorage[Looping] = AlphaNumeric[((Math.random() * (AlphaNumeric.length-1)).toFixed(0))];
		}
		return ArrayStorage.join("");
	};
	/*
	|------------------------------------------------------------------------------
	| Inicializando o GUID do dispositivo
	|------------------------------------------------------------------------------
	*/
	window.appReebok.Device.UUID = ($.localStorage('UUID') == null ? appReebok.RandomString(128) : $.localStorage('UUID'));
	if ($.localStorage('UUID') == null)
		$.localStorage('UUID', appReebok.Device.UUID);
	/*
	|------------------------------------------------------------------------------
	| Inicializando visão principal
	|------------------------------------------------------------------------------
	*/
	window.mainView = appReebok.addView('.view-main');
	/*
	|------------------------------------------------------------------------------
	| Definindo funções globais do Dom7 para a variável $$ para prevenir conflitos
	| com outras frameworks, tal como jQuery or Zepto.
	|------------------------------------------------------------------------------
	*/
	window.$$ = Dom7;
})();
/*
|------------------------------------------------------------------------------
| Eventos executados em todos as requisições AJAX
|------------------------------------------------------------------------------
*/
$$(document).on('ajaxStart', function (e) {
	if (! appReebok.Device.Resumed)
		return;
	if(appReebok.enableIndicator)
		appReebok.showIndicator();
	if(appReebok.enableProgressbar) {
		var progressContainer = $$('body');
	    if (progressContainer.children('.progressbar, .progressbar-infinite').length) {
	    	return; 
	    }
	    appReebok.showProgressbar(progressContainer, 'reebok');
	}	
});
$$(document).on('ajaxComplete', function (e) {
	if (! appReebok.Device.Resumed)
		return;
	appReebok.hideIndicator();	
	appReebok.hideProgressbar();	
	var PullToRefresh = $$('.page-on-center .pull-to-refresh-content');
	if (PullToRefresh.length != 0) {
		PullToRefresh.on('ptr:refresh', function(e) {
			setTimeout(function(){
				appReebok.Reload();	
			},500);
		});
	}
});
/*
|------------------------------------------------------------------------------
| Service Worker Initialize
|------------------------------------------------------------------------------
*/
// appReebok.SW.Register();
/*
|------------------------------------------------------------------------------
| Recuperando IPv4
|------------------------------------------------------------------------------
*/
try {
	window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;//compatibility for Firefox and chrome
	var _noop = function(){}; 
	var _localhost = new RTCPeerConnection({iceServers:[]});     
		_localhost.createDataChannel('');
		_localhost.createOffer(_localhost.setLocalDescription.bind(_localhost), _noop);
		_localhost.onicecandidate = function(ice) {
			try {
				if (ice && ice.candidate && ice.candidate.candidate) {
					appReebok.Device.IPv4 = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(ice.candidate.candidate)[0];
					appReebok.Resume();
				}
			} catch(_exception) {
				appReebok.Resume();
			};
		};
} catch(_exception) {
	appReebok.Resume();
};
/*
|------------------------------------------------------------------------------
| Ajustes globais ao carregar o documento
|------------------------------------------------------------------------------
*/
jQuery(document).ready(function($) {
	/*
	|------------------------------------------------------------------------------
	| Gerênciamento de history back
	|------------------------------------------------------------------------------
	*/
	if (window.history && window.history.pushState) {
		jQuery(window).on('popstate', function(_event) {
			if (window.location.hash == ''){
				appReebok.Refresh();
			} else {
				appReebok.closeModal();
				_event.preventDefault();
			}
		});
	}
});