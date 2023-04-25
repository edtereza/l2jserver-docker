'use strict';
/*
 * ------------------------------------------------------------------------------ 
 * Tela :: Splash
 * ------------------------------------------------------------------------------
 */
appReebok.onPageInit('splash', function(page) {
	setTimeout(function(){
		appReebok.Resume();
	},1000);
});
/*
|------------------------------------------------------------------------------
| Tela :: Login
|------------------------------------------------------------------------------
*/
appReebok.onPageInit('login', function(page) {
	var _loginRequest = undefined;
	$$('.page[data-page=login] [data-action=show-hide-password]').on('click', function() {
		if ($$('.page[data-page=login] input[data-toggle=show-hide-password]').attr('type') === 'password') {
			$$('.page[data-page=login] input[data-toggle=show-hide-password]').attr('type', 'text');
			$$(this).attr('title', 'Ocultar');
			$$(this).children('i').text('visibility_off');
		}
		else {
			$$('.page[data-page=login] input[data-toggle=show-hide-password]').attr('type', 'password');
			$$(this).attr('title', 'Exibir');
			$$(this).children('i').text('visibility');
		}
	});
	$('.page[data-page=login] form[name=login]').validate({
		rules: {
			username: {
				required: true
			},
			password: {
				required: true
			}
		},
		messages: {
			username: {
				required: 'Informe seu e-mail, código reebok ou CPF registrado.',
			},
			password: {
				required: 'Informe sua senha.'
			}
		},
		onkeyup: false,
		errorElement : 'div',
		errorPlacement: function(error, element) {
			error.appendTo(element.parent().siblings('.input-error'));
		},
		submitHandler: function(form) {
			var _loginFormData = $(form).serialize();
			var _loginFormAction = $(form).attr('action');
			var _loginFormMethod = $(form).attr('method');
			if (_loginRequest != undefined) {
				try {
					_loginRequest.abort();	
				}
				catch(_exception){
					console.log(_exception);
				}
			}
			_loginRequest = $.ajax({
		        url : _loginFormAction,
		        type : _loginFormMethod,
		        data : _loginFormData,
		        beforeSend: function() {
		        	appReebok.Processing.Show();
		        	$('.page[data-page=login] form[name=login] button[type=submit]').attr('disabled', 'disabled');
		        },
		        error : function(xhr, ajaxOptions, thrownError) {
		        	if (thrownError == 'abort') return;
		        	appReebok.Processing.Hide();
		        	swal({
						title: 'Atenção',
						html: "Houve uma falha ao processar seu login.<br/><br/>Tente novamente...",
						type: 'warning',
						confirmButtonColor: '#B91817',
						confirmButtonText: 'Ok'
					}).then(function(result) {
						$('.page[data-page=login] form[name=login] input[name=password]').val('');
						$('.page[data-page=login] form[name=login] input[name=username]').focus();
						$('.page[data-page=login] form[name=login] input[name=username]').select();	
					});	
		        	$('.page[data-page=login] form[name=login] button[type=submit]').removeAttr('disabled');
		        },
		        success : function(data, textStatus, jqXHR) {
		        	if (data.goto == undefined && data.code == undefined) {
		        		appReebok.Processing.Hide();
		        		$('.page[data-page=login] form[name=login] button[type=submit]').removeAttr('disabled');
		        		swal({
							title: 'Atenção',
							html: "Houve uma falha ao processar seu login.<br/><br/>Tente novamente...",
							type: 'warning',
							confirmButtonColor: '#B91817',
							confirmButtonText: 'Ok'
						}).then(function(result) {
							$('.page[data-page=login] form[name=login] input[name=password]').val('');
							$('.page[data-page=login] form[name=login] input[name=username]').focus();
							$('.page[data-page=login] form[name=login] input[name=username]').select();	
						});	
		        	} else if (data.code != undefined) {
		        		appReebok.Processing.Hide();
		        		$('.page[data-page=login] form[name=login] button[type=submit]').removeAttr('disabled');
		        		swal({
							title: data.info,
							html: data.data,
							type: 'warning',
							confirmButtonColor: '#B91817',
							confirmButtonText: 'Ok'
						}).then(function(result) {
							$('.page[data-page=login] form[name=login] input[name=password]').val('');
							$('.page[data-page=login] form[name=login] input[name=username]').focus();
							$('.page[data-page=login] form[name=login] input[name=username]').select();
						});
		        		
		        	} else {
		        		appReebok.Load({
							url: data.goto
						});
		        	}
		        	
		        }
		    });	
		}
	});
	setTimeout(function(){
		$('.page[data-page=login] form[name=login] input[name=username]').focus();
		$('.page[data-page=login] form[name=login] input[name=username]').select();
	},800);
});
/*
|------------------------------------------------------------------------------
| Tela :: Logout
|------------------------------------------------------------------------------
*/
appReebok.onPageInit('logout', function(page) {
	setTimeout(function(){
		appReebok.Logout();
	},1000);
});
/*
|------------------------------------------------------------------------------
| Tela :: Expired
|------------------------------------------------------------------------------
*/
appReebok.onPageInit('expired', function(page) {
	setTimeout(function(){
		appReebok.Logout();
	},1000);
});
/*
|------------------------------------------------------------------------------
| Tela :: Registro
|------------------------------------------------------------------------------
*/
appReebok.onPageInit('sign-up', function(page) {
	var onPageInitRegistroXMLRequest = undefined; 
	$('.page[data-page=sign-up] form[name=sign-up]').validate({
		rules: {
			code: {
				required: true,
			},
			email: {
				required: true,
				email:true
			}
		},
		messages: {
			code: {
				required: 'Informe seu código de aluno.'
			},
			email: {
				required: 'Informe seu e-mail registrado.',
				email: 'Informe um endereço de e-mail válido.'
			}
		},
		onkeyup: false,
		errorElement : 'div',
		errorPlacement: function(error, element) {
			error.appendTo(element.parent().siblings('.input-error'));
		},
		submitHandler: function(form) {
			if (onPageInitRegistroXMLRequest != undefined) {
				try {
					onPageInitRegistroXMLRequest.abort();	
				}
				catch(_exception){
					//console.log(_exception);
				}
			}
			onPageInitRegistroXMLRequest =  $.ajax({
		        url: $(form).attr('action'),
		        type: 'POST',
		        data: $(form).serialize(), 
		        beforeSend: function() {
		        	appReebok.Processing.Show();
		        },
		        error : function(xhr, ajaxOptions, thrownError) {
		        	appReebok.Processing.Hide();
		        	if (thrownError == 'abort') return;
		        	swal({
						title: 'Atenção',
						text: "Houve um erro ao tentar efetuar seu registro.",
						type: 'warning',
						confirmButtonColor: '#B91817',
						confirmButtonText: 'Ok'
					}).then(function(result) { });
		        },
		        success : function(data, textStatus, jqXHR) {
		        	appReebok.Processing.Hide();
		        	if (data.code === undefined) {
		        		swal({
		    				title: 'Atenção',
		    				text: "Houve um erro ao tentar efetuar seu registro, tente novamente.",
		    				type: 'warning',
		    				confirmButtonColor: '#B91817',
		    				confirmButtonText: 'Ok'
		    			}).then(function(result) { });
		        	} else {
		        		if (data.code == 0) {
			        		swal({
			        			timer: 3000,
			    				title: data.info,
			    				text: data.data,
			    				type: 'success',
			    				showCancelButton: false,
								showConfirmButton: false,
			    			}).then(function(result) {
			    				if (data.goto !== undefined)
				    				appReebok.Load({
				    					url: data.goto
				    				});	
			    			});
		        			
		        		} else {
			        		swal({
			        			title: data.info,
			    				text: data.data,
			    				type: 'warning',
			    				confirmButtonColor: '#B91817',
			    				confirmButtonText: 'Ok'
			    			}).then(function(result) { });
		        		}
		        	}
		        }
		    });
		}
	});
	setTimeout(function(){
		$('.page[data-page=sign-up] form[name=sign-up] input[name=email]').val('');
		$('.page[data-page=sign-up] form[name=sign-up] input[name=code]').val('')
		$('.page[data-page=sign-up] form[name=sign-up] input[name=code]').focus();
		$('.page[data-page=sign-up] form[name=sign-up] input[name=code]').select();
	},800);
});	
/*
|------------------------------------------------------------------------------
| Tela :: Recupera Senha
|------------------------------------------------------------------------------
*/
appReebok.onPageInit('password-recover', function(page) {
	var onPageInitRegistroXMLRequest = undefined; 
	$('.page[data-page=password-recover] form[name=password-recover]').validate({
		rules: {
			email: {
				required: true,
				email:true
			},
			codigo: {
				required: true,
			}
		},
		messages: {
			email: {
				required: 'Informe seu e-mail registrado.',
				email: 'Informe um endereço de e-mail válido.'
			},
			codigo: {
				required: 'Informe seu código de aluno.'
			}
		},
		onkeyup: false,
		errorElement : 'div',
		errorPlacement: function(error, element) {
			error.appendTo(element.parent().siblings('.input-error'));
		},
		submitHandler: function(form) {
			if (onPageInitRegistroXMLRequest != undefined) {
				try {
					onPageInitRegistroXMLRequest.abort();	
				}
				catch(_exception){
					//console.log(_exception);
				}
			}
			onPageInitRegistroXMLRequest =  $.ajax({
		        url: $(form).attr('action'),
		        type: 'POST',
		        data: $(form).serialize(), 
		        beforeSend: function() {
		        	appReebok.Processing.Show();
		        },
		        error : function(xhr, ajaxOptions, thrownError) {
		        	appReebok.Processing.Hide();
		        	if (thrownError == 'abort') return;
		        	swal({
						title: 'Atenção',
						text: "Houve um erro ao tentar efetuar seu registro.",
						type: 'warning',
						confirmButtonColor: '#B91817',
						confirmButtonText: 'Ok'
					}).then(function(result) { });
		        },
		        success : function(data, textStatus, jqXHR) {
		        	appReebok.Processing.Hide();
		        	if (data.code === undefined) {
		        		swal({
		    				title: 'Atenção',
		    				text: "Houve um erro ao tentar efetuar seu registro, tente novamente.",
		    				type: 'warning',
		    				confirmButtonColor: '#B91817',
		    				confirmButtonText: 'Ok'
		    			}).then(function(result) { });
		        	} else {
		        		if (data.code == 0) {
		        			swal({
			        			timer: 2000,
			    				title: data.info,
			    				text: data.data,
			    				type: 'success',
			    				showCancelButton: false,
								showConfirmButton: false,
			    			}).then(function(result) {
			    				if (data.goto != undefined) {
				        			appReebok.Load({
				    					url: data.goto
				    				});
			    				}
			    			});

		        		} else {
			        		swal({
			        			title: data.info,
			    				text: data.data,
			    				type: 'warning',
			    				confirmButtonColor: '#B91817',
			    				confirmButtonText: 'Ok'
			    			}).then(function(result) { });
		        		}
		        	}
		        }
		    });
		}
	});
	setTimeout(function(){
		$('.page[data-page=password-recover] form[name=password-recover] input[name=email]').val('');
		$('.page[data-page=password-recover] form[name=password-recover] input[name=code]').val('')
		$('.page[data-page=password-recover] form[name=password-recover] input[name=code]').focus();
		$('.page[data-page=password-recover] form[name=password-recover] input[name=code]').select();
	},800);
});	
/*
|------------------------------------------------------------------------------
| Tela :: Terms
|------------------------------------------------------------------------------
*/
appReebok.onPageInit('terms', function(page) { 
	//:: Eventos :: Pull to refresh
	$$('.page[data-page=linked-account] .pull-to-refresh-content').on('ptr:refresh', function(e) {	
		setTimeout(function(){
			appReebok.Reload();
		},800);
	});
	//:: Eventos :: Click no card com as informações das contas vinculadas
	var _termsRequest = undefined; 
	$('.page[data-page=terms] .button').click(function(e){
		var _termsEvent = $(this).data('event');
		var _termsEventRequest = $(this).data('request');
		var _termsEventMethod = $(this).data('method');
		if (_termsRequest != undefined) {
			try {
				_linkedAccountLoginRequest.abort();	
			}
			catch(_exception){
				console.log(_exception);
			}
		}
		_termsRequest = $.ajax({
	        url: _termsEventRequest,
	        type: _termsEventMethod,
	        data: {
	        	event: _termsEvent
	        },
	        beforeSend: function() {
	        	appReebok.Processing.Show();
	        },
	        error : function(xhr, ajaxOptions, thrownError) {
	        	appReebok.Processing.Hide();
	        	if (thrownError == 'abort') return;
	        	swal({
					title: 'Atenção',
					html: "Houve um erro ao executar a ação desejada.<br/><br/>Tente novamente...",
					type: 'warning',
					confirmButtonColor: '#B91817',
					confirmButtonText: 'Ok'
				}).then(function(result) { });
	        },
	        success : function(data, textStatus, jqXHR) {
	        	appReebok.Processing.Hide();
	        	if (data.goto === undefined && data.code === undefined) {
	        		swal({
	    				title: 'Atenção',
	    				html: "Houve um erro ao executar a ação desejada.<br/><br/>Tente novamente...",
	    				type: 'warning',
	    				confirmButtonColor: '#B91817',
	    				confirmButtonText: 'Ok'
	    			}).then(function(result) {
	    				appReebok.Processing.Hide();
	    			});
	        	} else {
	        		if (data.goto !== undefined) {
	        			appReebok.Load({
	    					url: data.goto
	    				});
	        		} else if (data.code !== undefined) {
	        			swal({
		        			title: data.info,
		        			html: data.data,
		    				type: 'warning',
		    				confirmButtonColor: '#B91817',
		    				confirmButtonText: 'Ok'
		    			}).then(function(result) { 
		    				appReebok.Processing.Hide();
		    			});
	        		} else {
	        			swal({
		    				title: 'Atenção',
		    				html: "Houve um erro ao executar a ação desejada.<br/><br/>Tente novamente...",
		    				type: 'warning',
		    				confirmButtonColor: '#B91817',
		    				confirmButtonText: 'Ok'
		    			}).then(function(result) {
		    				appReebok.Processing.Hide();
		    			});
	        		}
	        	}
	        }
	    });
	});
});
/*
|------------------------------------------------------------------------------
| Tela :: Linked Account
|------------------------------------------------------------------------------
*/
appReebok.onPageInit('linked-account', function(page) { 
	//:: Eventos :: Pull to refresh
	$$('.page[data-page=linked-account] .pull-to-refresh-content').on('ptr:refresh', function(e) {	
		setTimeout(function(){
			appReebok.Reload();
		},800);
	});
	//:: Eventos :: Click no card com as informações das contas vinculadas
	var _linkedAccountLoginRequest = undefined; 
	$('.page[data-page=linked-account] .card').click(function(e){
		var _linkedAccount = $(this).data('code');
		var _linkedAccountRequest = $(this).data('request');
		var _linkedAccountMethod = $(this).data('method');
		if (_linkedAccountLoginRequest != undefined) {
			try {
				_linkedAccountLoginRequest.abort();	
			}
			catch(_exception){
				//console.log(_exception);
			}
		}
		_linkedAccountLoginRequest = $.ajax({
	        url: _linkedAccountRequest,
	        type: _linkedAccountMethod,
	        data: {
	        	code: _linkedAccount
	        },
	        beforeSend: function() {
	        	appReebok.Processing.Show();
	        },
	        error : function(xhr, ajaxOptions, thrownError) {
	        	appReebok.Processing.Hide();
	        	if (thrownError == 'abort') return;
	        	swal({
					title: 'Atenção',
					html: "Houve um erro ao tentar selecionar este perfil.<br/><br/>Tente novamente...",
					type: 'warning',
					confirmButtonColor: '#B91817',
					confirmButtonText: 'Ok'
				}).then(function(result) { });
	        },
	        success : function(data, textStatus, jqXHR) {
	        	appReebok.Processing.Hide();
	        	if (data.goto === undefined && data.code === undefined) {
	        		swal({
	    				title: 'Atenção',
	    				html: "Houve um erro ao tentar selecionar este perfil.<br/><br/>Tente novamente...",
	    				type: 'warning',
	    				confirmButtonColor: '#B91817',
	    				confirmButtonText: 'Ok'
	    			}).then(function(result) {
	    				appReebok.Processing.Hide();
	    			});
	        	} else {
	        		if (data.goto !== undefined) {
	        			appReebok.Load({
	    					url: data.goto
	    				});
	        		} else if (data.code !== undefined) {
	        			swal({
		        			title: data.info,
		        			html: data.data,
		    				type: 'warning',
		    				confirmButtonColor: '#B91817',
		    				confirmButtonText: 'Ok'
		    			}).then(function(result) { 
		    				appReebok.Processing.Hide();
		    			});
	        		} else {
	        			swal({
		    				title: 'Atenção',
		    				html: "Houve um erro ao tentar selecionar este perfil.<br/><br/>Tente novamente...",
		    				type: 'warning',
		    				confirmButtonColor: '#B91817',
		    				confirmButtonText: 'Ok'
		    			}).then(function(result) {
		    				appReebok.Processing.Hide();
		    			});
	        		}
	        	}
	        }
	    });
	});
});

/*
|------------------------------------------------------------------------------
| Tela :: Home
|------------------------------------------------------------------------------
*/
appReebok.onPageInit('home', function(page) {
	//:: Solicitação :: Menu Principal
	appReebok.Menu.Main();
	//:: Evento :: Botões de resumo
	$('.page[data-page=home] .resume-button').click(function(e){
		e.preventDefault();
		$('.page[data-page=home] .resume-button').removeClass('active');
		$('.page[data-page=home] .resume-activity').removeClass('resume-day');
		$('.page[data-page=home] .resume-activity').removeClass('resume-week');
		$('.page[data-page=home] .resume-activity').removeClass('resume-month');
		$('.page[data-page=home] .resume-detail').removeClass('resume-day');
		$('.page[data-page=home] .resume-detail').removeClass('resume-week');
		$('.page[data-page=home] .resume-detail').removeClass('resume-month');
		var _display = $(this).data('display');
		var _steps = $(this).data('steps');
		var _calories = $(this).data('calories');
		var _activity = $(this).data('activity');
		$(this).addClass('active');
		$('.page[data-page=home] .resume-activity').addClass('resume-' + _display);
		$('.page[data-page=home] .resume-detail').addClass('resume-' + _display);
		
		$('.page[data-page=home] .resume-activity .number').html(_activity);
		$('.page[data-page=home] .resume-detail-item.steps .number').html(_steps);
		$('.page[data-page=home] .resume-detail-item.calories .number').html(_calories);
		if(_activity == 1)
			$('.page[data-page=home] .resume-activity .display').html('ATIVIDADE');
		else
			$('.page[data-page=home] .resume-activity .display').html('ATIVIDADES');
		if(_steps == 1)
			$('.page[data-page=home] .resume-detail-item.steps .display').html('PASSO');
		else
			$('.page[data-page=home] .resume-detail-item.steps .display').html('PASSOS');
		if(_calories == 1)
			$('.page[data-page=home] .resume-detail-item.calories .display').html('CALORIA');
		else
			$('.page[data-page=home] .resume-detail-item.calories .display').html('CALORIAS');
	});
	//:: Evento :: QRCode
	var _homeQRCodeXHRStandBy = 5000;
	var _homeQRCodeXHRTimeout = undefined;
	var _homeQRCodeXHRRequest = undefined;
	var _homeQRCodeXHREvent = function() {
		if ($('.popup-qrcode').is(':visible')) {
			if (_homeQRCodeXHRRequest != undefined) {
				try {
					_homeQRCodeXHRRequest.abort();	
				}
				catch(_exception){
					console.log(_exception);
				}
			}
			_homeQRCodeXHRRequest = $.ajax({
		        url : $('.page[data-page=home] .button-qrcode').data('request'),
		        type : $('.page[data-page=home] .button-qrcode').data('method'),
		        data : {},
		        beforeSend: function() { },
		        error : function(xhr, ajaxOptions, thrownError) {
		        	if (thrownError == 'abort') return;
		        },
		        success : function(data, textStatus, jqXHR) {
		        	$('.popup-qrcode .qrcode-image').attr('src','data:' + data.mimetype + ';base64,' + data.data);
		        },
		        complete: function() {
		        	if (_homeQRCodeXHRTimeout !== undefined) {
						try {
							clearTimeout(_homeQRCodeXHRTimeout);	
						}
						catch(_exception){
							console.log(_exception);
						}
					}
	        		_homeQRCodeXHRStandBy = 5000;
		        	_homeQRCodeXHRTimeout = setTimeout(function(){ _homeQRCodeXHREvent() }, _homeQRCodeXHRStandBy);
		        }
		    });	
		}
	}
	$('.page[data-page=home] .button-qrcode').click(function(e){
		if (_homeQRCodeXHRTimeout !== undefined) {
			try {
				clearTimeout(_homeQRCodeXHRTimeout);	
			}
			catch(_exception){
				console.log(_exception);
			}
		}
		_homeQRCodeXHRTimeout = setTimeout(function(){ _homeQRCodeXHREvent() }, 1000);
	});
	$('.popup-qrcode .close-popup').click(function(e){ 
		if (_homeQRCodeXHRTimeout !== undefined) {
			try {
				clearTimeout(_homeQRCodeXHRTimeout);	
			}
			catch(_exception){
				console.log(_exception);
			}
		}
	});
	
	//:: Redirect URL
	var _redirect = $$('.page[data-page=home]').data('redirect');
	if (_redirect !== undefined) {
		setTimeout(function(){
			appReebok.Load({
				url: _redirect
			});
		},800);
	}
});
/*
|------------------------------------------------------------------------------
| Tela :: Profile
|------------------------------------------------------------------------------
*/
appReebok.onPageInit('profile', function(page) {
	//:: Eventos :: Pull to refresh
	$$('.page[data-page=home] .pull-to-refresh-content').on('ptr:refresh', function(e) {	
		setTimeout(function(){
			appReebok.Reload();
		},800);
	});
	var _profileMetricRequest = undefined;
	var _profileNicknameRequest = undefined;

	//:: Alteração do Apelido
	$('.page[data-page=profile] form[name=nickname] button').attr('disabled',true);
	$('.page[data-page=profile] form[name=nickname] button').addClass('disabled');
	$('.page[data-page=profile] input[name=nickname]').keyup(function(_event) {
        if (_event.which == 13) {
        	_event.preventDefault();
            return false;
        } else {
    		var _last = $(this).data('nickname');
    		var _current = $(this).val();
    		if (_last != _current) {
    			$('.page[data-page=profile] form[name=nickname] button').attr('disabled',false);
    			$('.page[data-page=profile] form[name=nickname] button').removeClass('disabled');
    		} else {
    			$('.page[data-page=profile] form[name=nickname] button').attr('disabled',true);
    			$('.page[data-page=profile] form[name=nickname] button').addClass('disabled');
    		}
        }
    }).keydown(function(_event) {
        if (_event.which == 13) {
            _event.preventDefault();
            return false;
        }
    }); 	
	$('.page[data-page=profile] form[name=nickname]').validate({
		rules: {
			nickname: {
				required: true,
				maxlength: 30,
				minlength: 3,
			},
		},
		messages: {
			nickname: {
				required: 'Informe seu apelido, ou como deseja ser chamado.',
				maxlength: 'Seu apelido não deve ter mais que 30 caracteres.',
				minlength: 'Seu apelido deve ter no minimo menos 3 caracteres.',
			},
		},
		onkeyup: false,
		errorElement : 'div',
		errorPlacement: function(error, element) {
			error.appendTo(element.parent().siblings('.input-error'));
		},
		submitHandler: function(form) {
			if (_profileNicknameRequest != undefined) {
				try {
					_profileNicknameRequest.abort();	
				}
				catch(_exception){
					console.log(_exception);
				}
			}
			_profileNicknameRequest = $.ajax({
		        url : $(form).attr('action'),
		        type : $(form).attr('method'),
		        data : $(form).serialize(),
		        beforeSend: function() {
		        	appReebok.Processing.Show();
		        	$('.page[data-page=profile] form[name=apelido] button').attr('disabled',true);
	    			$('.page[data-page=profile] form[name=apelido] button').addClass('disabled');
		        },
		        error : function(xhr, ajaxOptions, thrownError) {
		        	appReebok.Processing.Hide();
		        	if (thrownError == 'abort') return;
		        	$('.page[data-page=profile] form[name=apelido] button').attr('disabled',false);
	    			$('.page[data-page=profile] form[name=apelido] button').removeClass('disabled');
	        		appReebok.addNotification({
	        			message: 'Houve uma falha ao atualizar seu apelido.',
	        			button: null,
	        			hold: 1000,
	        			closeOnClick: true,
	        			onClose: function() { }
	        	    });
		        },
		        success : function(data, textStatus, jqXHR) {
		        	appReebok.Processing.Hide();
		        	appReebok.addNotification({
	        			message: 'Apelido atualizado com sucesso.',
	        			button: null,
	        			hold: 1000,
	        			closeOnClick: true,
	        			onClose: function() { 
	        			}
	        	    });
		        	$('.page[data-page=profile] input[name=apelido]').data('nickname',$('.page[data-page=profile] input[name=nickname]').val());
		        	$('.page[data-page=profile] form[name=apelido] button').attr('disabled',true);
	    			$('.page[data-page=profile] form[name=apelido] button').addClass('disabled');
		        }
		    });	

		}
	});
	//:: Alteração do Peso e Altura
	var _metricCheck = function(){
		var _lastHeight = $('.page[data-page=profile] form[name=metric] input[name=height]').data('weight');
		var _lastWeight = $('.page[data-page=profile] form[name=metric] input[name=weight]').data('weight');
		var _currentHeight = $('.page[data-page=profile] form[name=metric] input[name=height]').val();
		var _currentWeight = $('.page[data-page=profile] form[name=metric] input[name=weight]').val();
		if (_lastHeight != _currentHeight || _lastWeight != _currentWeight) {
			$('.page[data-page=profile] form[name=metric] button').attr('disabled',false);
			$('.page[data-page=profile] form[name=metric] button').removeClass('disabled');
		} else {
			$('.page[data-page=profile] form[name=metric] button').attr('disabled',true);
			$('.page[data-page=profile] form[name=metric] button').addClass('disabled');
		}
	}
	$('.page[data-page=profile] form[name=metric] button').attr('disabled',true);
	$('.page[data-page=profile] form[name=metric] button').addClass('disabled');
	$('.page[data-page=profile] input[name=weight]').keyup(function(_event) {
        if (_event.which == 13) {
        	_event.preventDefault();
            return false;
        } else {
        	_metricCheck();
        }
    }).keydown(function(_event) {
        if (_event.which == 13) {
            _event.preventDefault();
            return false;
        }
    }).change(function(_event) {
    	_metricCheck();
    }).focus(function(){
    	var _value = $('.page[data-page=profile] form[name=metric] input[name=weight]').val();
    		_value = parseInt(_value)/
    	$('.page[data-page=profile] form[name=metric] input[name=weight]').val(_value);
    });
	$('.page[data-page=profile] input[name=height]').keyup(function(_event) {
        if (_event.which == 13) {
        	_event.preventDefault();
            return false;
        } else {
        	_metricCheck();
        }
    }).keydown(function(_event) {
        if (_event.which == 13) {
            _event.preventDefault();
            return false;
        }
    }).change(function() {
    	_metricCheck();
    }).focus(function(){
    	var _value = $('.page[data-page=profile] form[name=metric] input[name=height]').val();
			_value = parseInt(_value)/
		$('.page[data-page=profile] form[name=metric] input[name=height]').val(_value);
    });
	$('.page[data-page=profile] form[name=metric]').validate({
		rules: {
			height: {
				required: true,
				maxlength: 3,
				minlength: 2,
			},
			weight: {
				required: true,
				maxlength: 3,
				minlength: 2,
			},
		},
		messages: {
			height: {
				required: 'Sua altura deve ser informada corretamente.',
				maxlength: 'Sua altura deve ser informada corretamente.',
				minlength: 'Sua altura deve ser informada corretamente.',
			},
			weight: {
				required: 'Seu peso deve ser informado corretamente.',
				maxlength: 'Seu peso deve ser informado corretamente.',
				minlength: 'Seu peso deve ser informado corretamente.',
			},
		},
		onkeyup: false,
		errorElement : 'div',
		errorPlacement: function(error, element) {
			error.appendTo(element.parent().siblings('.input-error'));
		},
		submitHandler: function(form) {
			if (_profileMetricRequest != undefined) {
				try {
					_profileMetricRequest.abort();	
				}
				catch(_exception){
					console.log(_exception);
				}
			}
			_profileMetricRequest = $.ajax({
		        url : $(form).attr('action'),
		        type : $(form).attr('method'),
		        data : $(form).serialize(),
		        beforeSend: function() {
		        	appReebok.Processing.Show();
		        	$('.page[data-page=profile] form[name=metric] button').attr('disabled',true);
	    			$('.page[data-page=profile] form[name=metric] button').addClass('disabled');
		        },
		        error : function(xhr, ajaxOptions, thrownError) {
		        	appReebok.Processing.Hide();
		        	if (thrownError == 'abort') return;
		        	$('.page[data-page=profile] form[name=metric] button').attr('disabled',false);
	    			$('.page[data-page=profile] form[name=metric] button').removeClass('disabled');
	        		appReebok.addNotification({
	        			message: 'Houve uma falha ao atualizar seus dados de peso e altura.',
	        			button: null,
	        			hold: 2500,
	        			closeOnClick: true,
	        			onClose: function() { }
	        	    });
		        },
		        success : function(data, textStatus, jqXHR) {
		        	appReebok.Processing.Hide();
		        	appReebok.addNotification({
	        			message: 'Peso e altura atualizados com sucesso.',
	        			button: null,
	        			hold: 2500,
	        			closeOnClick: true,
	        			onClose: function() { 
	        			}
	        	    });
		        	$('.page[data-page=profile] form[name=metric] input[name=height]').data('height',$('.page[data-page=profile] input[name=height]').val());
		        	$('.page[data-page=profile] form[name=metric] input[name=weight]').data('weight',$('.page[data-page=profile] input[name=weight]').val());
		        	$('.page[data-page=profile] form[name=metric] button').attr('disabled',true);
	    			$('.page[data-page=profile] form[name=metric] button').addClass('disabled');
		        }
		    });	
		}
	});
	$('.page[data-page=profile] input[name=telao]').change(function(){
		var onPageInitProfileTelaoURL = $(this).data('request');
		var onPageInitProfileTelaoMethod = 'POST';
		var onPageInitProfileTelaoOculta = (this.checked ? 1 : 0);
		var onPageInitProfileTelaoControle = this;
		if (_profileRequest != undefined) {
			try {
				_profileRequest.abort();	
			}
			catch(_exception){
				console.log(_exception);
			}
		}
		_profileRequest = $.ajax({
	        url : onPageInitProfileTelaoURL,
	        type : onPageInitProfileTelaoMethod,
	        data : {
	        	hide: onPageInitProfileTelaoOculta
	        },
	        beforeSend: function() {
	        	appReebok.Processing.Show();
	        },
	        error : function(xhr, ajaxOptions, thrownError) {
	        	appReebok.Processing.Hide();
	        	if (thrownError == 'abort') return;
        		appReebok.addNotification({
        			message: 'Houve uma falha ao processar seu dispositivo, tente novamente.',
        			button: {
        				text: 'Ok',
        				color: 'reebok'
        			},
        			onClose: function() { }
        	    });
        		onPageInitProfileTelaoControle.checked = (onPageInitProfileTelaoDisplay ? false : true);
	        },
	        success : function(data, textStatus, jqXHR) {
	        	appReebok.Processing.Hide();
	        	var GoTo = data.goto;
	        	var Dataset = data.data;
	        	if (Dataset != undefined) {
	        		if (Dataset.Return === undefined) {
        				appReebok.addNotification({
		        			message: 'Houve uma falha ao processar seu dispositivo, tente novamente.',
		        			button: {
		        				text: 'Ok',
		        				color: 'reebok'
		        			},
		        			hold: 5000,
		        			closeOnClick: true,
		        			onClose: function() { }
		        	    });
        				onPageInitProfileTelaoControle.checked = (onPageInitProfileTelaoDisplay ? false : true);
	        		} else {
	        			if (Dataset.Return == 1) {
        					appReebok.addNotification({
			        			message: Dataset.Message.Content,
			        			button: null,
			        			hold: 2000,
			        			closeOnClick: true,
			        			onClose: function() { }
			        	    });		    		        		
		        		} else {
	        				appReebok.addNotification({
			        			message: Dataset.Message.Content,
			        			button: {
			        				text: 'Ok',
			        				color: 'reebok'
			        			},
			        			hold: 5000,
			        			closeOnClick: true,
			        			onClose: function() { }
			        	    });
	        				onPageInitProfileTelaoControle.checked = (onPageInitProfileTelaoDisplay ? false : true);
		        		}	
	        		}
	        	} else {
    				appReebok.addNotification({
	        			message: 'Houve uma falha ao processar seu dispositivo, tente novamente.',
	        			button: {
	        				text: 'Ok',
	        				color: 'reebok'
	        			},
	        			hold: 5000,
	        			closeOnClick: true,
	        			onClose: function() { }
	        	    });
    				onPageInitProfileTelaoControle.checked = (onPageInitProfileTelaoDisplay ? false : true);
	        	}
	        }
	    });	
	});
});
/*
|------------------------------------------------------------------------------
| Tela :: Activity
|------------------------------------------------------------------------------
*/
appReebok.onPageInit('activity', function(page) {
	//:: Eventos :: Pull to refresh
	$$('.page[data-page=activity] .pull-to-refresh-content').on('ptr:refresh', function(e) {	
		setTimeout(function(){
			appReebok.Reload();
		},800);
	});
	//:: Variável para controlar a requisição AJAX
	var _activityRequest = undefined;
	var _activityRequestURL = $('.page[data-page=activity]').data('request');
	var _activityRequestMethod = 'POST';
	var _activityRequestTarget = undefined;
	//:: Variável para armazenar as variáveis de filtro
	var _activityFilter = {
		display: undefined,
		location: undefined,
		date: undefined,
		area: undefined,
		modality : undefined,
		class : undefined,
		audience : undefined,
		week_day : undefined,
		day_time  : undefined,
	};
	//:: Função para carregar os dados
	var _activityLoad = function()
	{
		if (_activityRequest !== undefined) {
			try {
				_activityRequest.abort();
			}
			catch(e) {
				console.log(e);
			}
		}
		_activityRequest = $.ajax({
	        url : _activityRequestURL,
	        type : _activityRequestMethod,
	        data : _activityFilter,
	        beforeSend: function() {
	        	appReebok.Processing.Show();
	        },
	        error : function(xhr, ajaxOptions, thrownError) {
	        	appReebok.Processing.Hide();
	        	if (thrownError == 'abort') return;
	        },
	        success : function(data, textStatus, jqXHR) {
	        	appReebok.Processing.Hide();
	        	_activityGoTo();
	        	_activityDaytime(_activityFilter.day_time, true);
	        	_activityLocation(_activityFilter.location, true);
	        	if (_activityFilter.display == 'FULL') {
	        		$('.page[data-page=activity] .page-content .result').html(data);
	        		_activityTabLink();
	        	}	        	
	        }
	    });	
	};
	//:: Variável para controlar a requisição AJAX
	var _activityFilterRequest = undefined;
	var _activityFilterRequestURL = $('.page[data-page=activity]').data('filter');
	var _activityFilterRequestMethod = 'POST';
	var _activityFilterRequestTarget = undefined;
	var _activityFilterPickerAudience = undefined;
	var _activityFilterPickerArea = undefined;
	var _activityFilterPickerModality = undefined;
	var _activityFilterPickerClass = undefined;
	//:: Função para carregar os filtros
	
	var _activityFilterLoad = function (){
		if (_activityFilterRequest !== undefined) {
			try {
				_activityFilterRequest.abort();
			}
			catch(e) {
				console.log(e);
			}
		}
		_activityFilterRequest = $.ajax({
	        url : _activityFilterRequest,
	        type : _activityFilterRequestMethod,
	        data : _activityFilter,
	        beforeSend: function() {
	        	// appReebok.Processing.Show();
	        },
	        error : function(xhr, ajaxOptions, thrownError) {
	        	// appReebok.Processing.Hide();
	        	if (thrownError == 'abort') return;
	        },
	        success : function(data, textStatus, jqXHR) {
	        	// appReebok.Processing.Hide();
	        	      	
	        }
	    });		
	}
	//:: Função para gerenciar botões de unidades
	var _activityGoTo = function() 
	{
		$('.page[data-page=activity] .activity').click(function(){
			var _goTo = $(this).data('goto');
			if (_goTo !== undefined) {
				appReebok.Load({
					url: _goTo
				});
			}
		});
	}
	//:: Função para gerenciar botões de unidades
	var _activityLocation = function(Location) 
	{
		$('.page[data-page=activity] .toolbar-bottom .toolbar-inner a').each(function(){
			if ($(this).data('location') != Location) {
				$(this).removeClass('color-reebok');
				$(this).addClass('color-white');
			} else {
				$(this).addClass('color-reebok');
				$(this).removeClass('color-white');
			}
		});
	}
	//:: Função para gerenciar botões de unidades
	var _activityDaytime = function(Daytime, Apply) 
	{
		console.log(Daytime);
		$('.page[data-page=activity] .header .filter .filter-daytime .button').each(function(){
			console.log(this);
			if (Apply !== true) {
				if ($(this).data('daytime') != Daytime) {
					$(this).removeClass('active');
				} else {
					if ($(this).hasClass('active')) {
						$(this).removeClass('active');
						_activityFilter.day_time = null;
					}
					else
						$(this).addClass('active');
				}
			} else {
				if ($(this).data('daytime') != Daytime) {
					$(this).removeClass('active');
				} else {
					if (! $(this).hasClass('active'))
						$(this).addClass('active');
				}
			}
		});
	}
	//:: Função para gerenciar botões das tabs (FULL LOAD)
	var _activityTabLink = function()
	{
		//:: Gerenciando clicks nas TABS
		$('.page[data-page=activity] .tab-link').click(function(){
			_activityFilter.display = 'DATE'
			_activityFilter.date = $(this).data('date');
			_activityFilter.week_day = $(this).data('weekday');
			console.log(_activityFilter);
			 	
		});
	}
	//:: Carregando padrão do filtro
	_activityFilter.display = 'FULL';
	_activityFilter.location = ($.localStorage('LOCATION') == null ? null : $.localStorage('LOCATION'));
	_activityFilter.area = null;
	_activityFilter.modality = null;
	_activityFilter.class = null;
	_activityFilter.audience = null;
	_activityFilter.week_day = null;
	_activityFilter.day_time = null;
	if (_activityFilter.location == null)
		_activityFilter.location = $('.page[data-page=activity] .toolbar-bottom .toolbar-inner a').first().data('location');
	//:: Controle dos botões da unidade
	$('.page[data-page=activity] .toolbar-bottom .toolbar-inner a').click(function(e){
		e.preventDefault();
		_activityFilter.location = $(this).data('location');
		_activityFilter.area = null;
		_activityFilter.modality = null;
		_activityFilter.class = null;
		_activityFilter.audience = null;
		_activityFilter.week_day = null;
		_activityFilter.day_time = null;
		_activityFilter.display = 'FULL';
		_activityLocation(_activityFilter.location);
		_activityLoad();
	});
	//:: Controle dos botões de filtro da hora do dia
	$('.page[data-page=activity] .header .filter .filter-daytime .button').click(function(e){
		e.preventDefault();
		_activityFilter.day_time = $(this).data('daytime');
		_activityFilter.week_day = null;
		_activityFilter.display = 'FULL';
		_activityDaytime(_activityFilter.day_time);
		_activityLoad();
	});
	$('.page[data-page=activity] .header .filter .filter-daytime .button')
	//:: Inicializando botão da unidade
	_activityLocation(_activityFilter.location);
	//:: Solicitando grade inicial
	_activityFilterLoad();
	_activityLoad();	
});
/*
|------------------------------------------------------------------------------
| Tela :: Atividade / Detalhes
|------------------------------------------------------------------------------
*/
appReebok.onPageInit('activity-detail', function(page) {
	//:: Eventos :: Pull to refresh
	$$('.page[data-page=activity-detail] .pull-to-refresh-content').on('ptr:refresh', function(e) {	
		setTimeout(function(){
			appReebok.Reload();
		},800);
	});
	//:: Gerenciamento de redimencionamento automatico
	var _activityDetailOnResize = function() {
		if ($('.page[data-page=activity-detail]').hasClass('page-on-center')) {
			var Margin = 5;
			var MarginLine = 0;
			var MarginItem = 5;
			var Padding = 5;
			var MarginL = 10;
			var MarginR = 10;
			var WindowX = $(window).width();
			var LayoutX = $('.page[data-page=activity-detail]').width();
			var Columns = $($('.page[data-page=activity-detail]').find('.room-line')[0]).find('.room-line-item').length;
			if (Columns > 0) {
				var ColumnX = parseInt((LayoutX - (MarginL + MarginR + (Columns * Margin))) / Columns);
				var ColumnY = ColumnX;
				if (ColumnX > 42) {
					ColumnX = 40;
					ColumnY = ColumnX;
					Padding = 5;
					MarginItem = Math.floor(((WindowX - (ColumnX * Columns)) / 2) / Columns) - 3;
					MarginItem = (MarginItem > 3 ? 3 : MarginItem);
					MarginLine = MarginItem;
				} else if (ColumnX < 27) {
					ColumnX = 25;
					ColumnY = ColumnX;
					Padding = 1;
					MarginItem = 1;
					MarginLine = 0;
				} else {
					Padding =  Math.floor((ColumnX * 5) / 40) - 3;
					MarginItem = Math.floor(((WindowX - (ColumnX * Columns)) / 2) / Columns) - 3;
					MarginItem = (MarginItem < 0 ? 0 : MarginItem);
					MarginLine = (MarginItem < 2 ? 2 : MarginItem);;
				}
				$('.page[data-page=activity-detail]').find('.room-line').each(function(){
					$(this).css('margin-bottom',MarginLine + 'px');
					$(this).find('.room-line-item').each(function(){
						var ColumnEspecial = $(this).data('especial');
						if (ColumnEspecial == 'esteira' || ColumnEspecial == 'caixa' || ColumnEspecial == 'porta' || ColumnEspecial == 'parede')
							ColumnEspecial = 'w2x';
						$(this).css('margin',MarginItem + 'px');
						$(this).css('width',(ColumnEspecial == 'w2x' ? (ColumnX * 1.5) : ColumnX) + 'px');
						$(this).css('height',ColumnY + 'px');
						$(this).css('min-width',(ColumnEspecial == 'w2x' ? (ColumnX * 1.5) : ColumnX) + 'px');
						$(this).css('min-height',ColumnY + 'px');
						if($(this).hasClass('object')){
							$(this).css('padding','0px');
							$(this).find('img').css('width',(ColumnX - 10) + 'px');
							$(this).find('img').css('height',(ColumnX - 10) + 'px');
						} else {
							$(this).css('padding',Padding + 'px');						
						}
					});
				});
			}
			$('.page[data-page=activity-detail]').find('.room-line').each(function(){
				if (! $(this).is(":visible")) {
					 $(this).show();
				}
			});
		}
	};
	$(window).on("resize", function() {
		_activityDetailOnResize();
	}).resize();
	setTimeout(function(){
		_activityDetailOnResize();
	}, 500);
	
	//:: Modal da confirmação de reserva
	var _activityDetailSpotRequest = undefined;	
	var _activityDetailSpotHandler = undefined;
	var _activityDetailSpotOnClick = function() {
		var _url = $(_activityDetailSpotHandler).data('request');
		var _dbid = $(_activityDetailSpotHandler).data('object_id');
		var _name = $(_activityDetailSpotHandler).data('object_name');
		var _number = $(_activityDetailSpotHandler).data('number');
		var _booked = $(_activityDetailSpotHandler).data('booked') == 1 ? true : false;
		var _selected = $(_activityDetailSpotHandler).data('selected') == 1 ? true : false;
		var _disabled = $(_activityDetailSpotHandler).data('disabled') == 1 ? true : false;
		var _presence = $(_activityDetailSpotHandler).data('presence') == 1 ? true : false;
		var _confirmed = $(_activityDetailSpotHandler).data('confirmed') == 1 ? true : false;
		if (_url !== undefined ) {
			if (_presence) {
				swal({
					title: 'Presença Confirmada',
					html: "Sua presença foi confirmada na atividade.",
					type: 'info',
					confirmButtonColor: '#B91817',
					confirmButtonText: 'Ok'
				}).then(function(result) { });
			}
			else if (_disabled) {
				swal({
					title: 'Atenção',
					html: "Esta posição não esta disponível para ser reservada.",
					type: 'warning',
					confirmButtonColor: '#B91817',
					confirmButtonText: 'Ok'
				}).then(function(result) { });
			}
			else if (_booked && ! _selected) {
				swal({
					title: 'Atenção',
					html: "Esta posição já se encontra reservada por outra pessoa.",
					type: 'warning',
					confirmButtonColor: '#B91817',
					confirmButtonText: 'Ok'
				}).then(function(result) { });
			}
			else if (_confirmed) {
				swal({
					title: 'Aguardamos você!',
					html: "Você já confirmou que irá comparecer a esta atividade.<br/>Nos vemos em sala...",
					type: 'info',
					confirmButtonColor: '#B91817',
					confirmButtonText: 'Ok'
				}).then(function(result) { });
			}
			else {
				var _confirm = true;
				var _title = 'Confirmar Reserva';
				var _html = '<span style="font-size: 40px;  font-weight: bold; font-variant: small-caps;">' + _name + ' ' + _number + '</span><br/><br/>Você deseja efetuar a reserva desta posição para esta aula?<br/><br/>';
				var _type = 'question';
				var _button = 'SIM, RESERVAR';
				if (_booked && _selected) {
					_confirm = false;
					_title = 'Cancelar Reserva';	
					_html = '<span style="font-size: 40px; font-weight: bold; font-variant: small-caps;">' + _name + ' ' + _number + '</span><br/><br/>Você deseja cancelar a reserva efetuada?<br/><br/>';
					_button = 'SIM, CANCELAR';
				}
				swal({
					title: _title,
					html: _html,
					type: _type,
					showCloseButton: true,
					showCancelButton: true,
					confirmButtonText: _button,
					confirmButtonColor: '#25a312',
					cancelButtonText: "NÃO",
					cancelButtonColor: '#B91817',
				}).then(function(result) { 
					if (result.value) {
						if (_activityDetailSpotRequest != undefined) {
							try {
								_activityDetailSpotRequest.abort();	
							}
							catch(_exception){
								console.log(_exception);
							}
						}
						_activityDetailSpotRequest = $.ajax({
					        url : _url,
					        type : 'POST',
					        data : {
					        	booking: (_confirm == true ? 1 : 0),
					        	object: _dbid,
					        	number: _number,
					        },
					        beforeSend: function() {
					        	appReebok.Processing.Show();
					        },
					        error : function(xhr, ajaxOptions, thrownError) {
					        	if (thrownError == 'abort') return;
								swal({
									title: 'Atenção',
									html: "Houve um erro interno e a ação não pode ser realizada.<br/><br/>Tente novamente....",
									type: 'warning',
									confirmButtonColor: '#B91817',
									confirmButtonText: 'Ok'
								}).then(function(result) { 
									setTimeout(function(){
										appReebok.Reload();
									},250);
								});
					        },
					        success : function(data, textStatus, jqXHR) {
					        	if (data.success === undefined) {
					        		swal({
				        				timer: 2000,
										title: (data.resume !== undefined ? data.resume :  "Houve um erro interno e a ação não pode ser realizada.<br/><br/>Tente novamente...."),
										html: (data.detail !== undefined ? data.detail :  "Houve um erro interno e a ação não pode ser realizada.<br/><br/>Tente novamente...."),
										type: 'warning',
										showCancelButton: false,
										showConfirmButton: false,
									}).then(function(result) { 
										setTimeout(function(){
											appReebok.Reload();
										},250);	
									});
					        	}
					        	else {
					        		var _title = 'Reserva Confirmada';
					        		var _html = 'Sua reserva foi confirmada com sucesso.';
					        		if (! _confirm) {
					        			_title = 'Reserva Cancelada';
					        			_html = 'Sua reserva foi cancelada com sucesso.';		
					        		} 
					        		swal({
				        				timer: 2000,
										title: _title,
										html: _html,
										type: 'success',
										showCancelButton: false,
										showConfirmButton: true,
										confirmButtonColor: '#B91817',
										confirmButtonText: 'Ok'
									}).then(function(result) { 
										setTimeout(function(){
											appReebok.Reload();
										},250);	
									});
					        	}
					        }
					    });	
					}
				});
			} 
		}
	};
	var _bookingConfirmationRequest = undefined;
	$('.page[data-page=activity-detail] .button-confirmation').each(function(){
		$(this).click(function(e){
			e.preventDefault();
			var _url = $(this).data('request');
			var _event = $(this).data('event');
			var _number = $(this).data('number');
			var _object_id = $(this).data('object_id');
			var _object_name = $(this).data('object_name');
			//
			var _title = "";
			var _html = "";
			var _button = "";
			if (_event == 'cancel') {
				_title = 'Cancelar Reserva';	
				_html = '<span style="font-size: 40px; font-weight: bold; font-variant: small-caps;">' + _object_name + ' ' + _number + '</span><br/><br/>Você deseja cancelar a reserva efetuada?<br/><br/>';
				_button = 'SIM, CANCELAR';
			} else if (_event == 'confirm') {
				_title = 'Confirmar Reserva';	
				_html = '<span style="font-size: 40px; font-weight: bold; font-variant: small-caps;">' + _object_name + ' ' + _number + '</span><br/><br/>Você deseja confirmar que irá comparecer nesta atividade?<br/><br/>';
				_button = 'SIM, CONFIRMAR';
			}
			swal({
				title: _title,
				html: _html,
				type: 'question',
				showCloseButton: true,
				showCancelButton: true,
				confirmButtonText: _button,
				confirmButtonColor: '#25a312',
				cancelButtonText: "NÃO",
				cancelButtonColor: '#B91817',
			}).then(function(result) { 
				if (result.value) {
					if (_bookingConfirmationRequest != undefined) {
						try {
							_bookingConfirmationRequest.abort();	
						}
						catch(_exception){
							console.log(_exception);
						}
					}
					_bookingConfirmationRequest = $.ajax({
				        url : _url,
				        type : 'POST',
				        data : {
				        	booking: (_event == 'confirm' ? 1 : 0),
				        	object: _object_id,
				        	number: _number,
				        	event: _event
				        },
				        beforeSend: function() {
				        	appReebok.Processing.Show();
				        },
				        error : function(xhr, ajaxOptions, thrownError) {
				        	if (thrownError == 'abort') return;
							swal({
								title: 'Atenção',
								html: "Houve um erro interno e a ação não pode ser realizada.<br/><br/>Tente novamente....",
								type: 'warning',
								confirmButtonColor: '#B91817',
								confirmButtonText: 'Ok'
							}).then(function(result) { 
								setTimeout(function(){
									appReebok.Reload();
								},250);
							});
				        },
				        success : function(data, textStatus, jqXHR) {
				        	if (data.success === undefined) {
				        		swal({
			        				timer: 2000,
									title: (data.resume !== undefined ? data.resume :  "Houve um erro interno e a ação não pode ser realizada.<br/><br/>Tente novamente...."),
									html: (data.detail !== undefined ? data.detail :  "Houve um erro interno e a ação não pode ser realizada.<br/><br/>Tente novamente...."),
									type: 'warning',
									showCancelButton: false,
									showConfirmButton: false,
								}).then(function(result) { 
									setTimeout(function(){
										appReebok.Reload();
									},250);	
								});
				        	}
				        	else {
				        		var _title = 'Confirmado';
				        		var _html = 'O evento solicitado foi confirmado com sucesso.';
				        		if (_event == 'cancel') {
				        			_title = 'Reserva Cancelada';
				        			_html = 'Agradecemos por nos informar que não poderá comparecer a atividade.<br/>Mas caso mude de ideia, e existam vagas disponíveis, você poderá efetuar uma nova reserva.';		
				        		} 
				        		else if (_event == 'confirm') {
				        			_title = 'Reserva Confirmada';
				        			_html = 'Agradecemos por confirmar que irá comparecer nesta atividade..';		
				        		}
				        		swal({
			        				timer: 2000,
									title: _title,
									html: _html,
									type: 'success',
									showCancelButton: false,
									showConfirmButton: true,
									confirmButtonColor: '#B91817',
									confirmButtonText: 'Ok'
								}).then(function(result) { 
									setTimeout(function(){
										appReebok.Reload();
									},250);	
								});
				        	}
				        }
				    });	
				}
			});
		});
	});
	$('.page[data-page=activity-detail] .room-line-item').each(function(){
		$(this).click(function(e){
			e.preventDefault();
			_activityDetailSpotHandler = this;
			_activityDetailSpotOnClick();
		});
	});
	var _mettingWindow = undefined;
	$('.page[data-page=activity-detail] .button-window').click(function(event){
		// Recuperando o URL da reunião
		var _mettingURL = $(this).data('request');
		// Informações da Janela Centralizada
		var janela_TamanhoX = 660;
		var janela_TamanhoY = 800;
		var tela_TamanhoX = screen.width;
		var tela_TamanhoY = screen.height;
		var janela_PosicaoX = ((tela_TamanhoX / 2) - (janela_TamanhoX / 2));
			janela_PosicaoX = (janela_PosicaoX < 0 ? 0 : janela_PosicaoX);
		var janela_PosicaoY = ((tela_TamanhoY / 2) - (janela_TamanhoY / 2));
			janela_PosicaoY = (janela_PosicaoY - 20);
			janela_PosicaoY = (janela_PosicaoY < 0 ? 0 : janela_PosicaoY);
		// Fechando janelas existentes
		if (_mettingWindow !== undefined)
			_mettingWindow.close();
		// Abrindo e focando na nova janela
		_mettingWindow = window.open(_mettingURL,'mettingWindow','width=' + janela_TamanhoX + ',height=' + janela_TamanhoY + ',toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes, top=' + janela_PosicaoY + ', left=' + janela_PosicaoX);
		_mettingWindow.focus();
	});
});
/*
|------------------------------------------------------------------------------
| Tela :: Atividade / Detalhes (LIVE)
|------------------------------------------------------------------------------
*/
appReebok.onPageInit('activity-detail-live', function(page) {
	//:: Eventos :: Pull to refresh
	$$('.page[data-page=activity-detail-live] .pull-to-refresh-content').on('ptr:refresh', function(e) {	
		setTimeout(function(){
			appReebok.Reload();
		},800);
	});
	$('.page[data-page=activity-detail-live] .button-reload').click(function(event){
		appReebok.Reload();
	});
	var _mettingWindow = undefined;
	$('.page[data-page=activity-detail-live] .button-window').click(function(event){
		// Recuperando o URL da reunião
		var _mettingURL = $(this).data('request');
		// Informações da Janela Centralizada
		var janela_TamanhoX = 660;
		var janela_TamanhoY = 800;
		var tela_TamanhoX = screen.width;
		var tela_TamanhoY = screen.height;
		var janela_PosicaoX = ((tela_TamanhoX / 2) - (janela_TamanhoX / 2));
			janela_PosicaoX = (janela_PosicaoX < 0 ? 0 : janela_PosicaoX);
		var janela_PosicaoY = ((tela_TamanhoY / 2) - (janela_TamanhoY / 2));
			janela_PosicaoY = (janela_PosicaoY - 20);
			janela_PosicaoY = (janela_PosicaoY < 0 ? 0 : janela_PosicaoY);
		// Fechando janelas existentes
		if (_mettingWindow !== undefined)
			_mettingWindow.close();
		// Abrindo e focando na nova janela
		_mettingWindow = window.open(_mettingURL,'mettingWindow','width=' + janela_TamanhoX + ',height=' + janela_TamanhoY + ',toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes, top=' + janela_PosicaoY + ', left=' + janela_PosicaoX);
		_mettingWindow.focus();
	});
	countdown();
	
});


/*
|------------------------------------------------------------------------------
| Tela :: Settings 
|------------------------------------------------------------------------------
*/
appReebok.onPageInit('settings', function(page) {
	$('.page[data-page=settings] #terms').click(function (e) {
		e.preventDefault();
		swal({
			title: "ATENÇÃO",
			html: "Você será redirecionado um site externo mas dentro dos dominios da <b>Reebok Sports Club</b>.<br/><br/>Deseja prosseguir?",
			type: 'info',
			showCancelButton: true,
			showConfirmButton: true,
			cancelButtonColor: '#B91817',
			cancelButtonText: 'NÃO',
			confirmButtonColor: '#B91817',
			confirmButtonText: 'SIM'
		}).then(function(result) { 
			if (result.value !== undefined && result.value === true)
				window.open("https://policies.reebokclub.com.br/#!//policy/terms");
		});
	});
	$('.page[data-page=settings] #policy-privacy').click(function (e) {
		e.preventDefault();
		swal({
			title: "ATENÇÃO",
			html: "Você será redirecionado um site externo mas dentro dos dominios da <b>Reebok Sports Club</b>.<br/><br/>Deseja prosseguir?",
			type: 'info',
			showCancelButton: true,
			showConfirmButton: true,
			cancelButtonColor: '#B91817',
			cancelButtonText: 'NÃO',
			confirmButtonColor: '#B91817',
			confirmButtonText: 'SIM'
		}).then(function(result) { 
			if (result.value !== undefined && result.value === true)
				window.open("https://policies.reebokclub.com.br/#!//policy/privacy");
		});
	});
	$('.page[data-page=settings] #policy-booking').click(function (e) {
		e.preventDefault();
		swal({
			title: "ATENÇÃO",
			html: "Você será redirecionado um site externo mas dentro dos dominios da <b>Reebok Sports Club</b>.<br/><br/>Deseja prosseguir?",
			type: 'info',
			showCancelButton: true,
			showConfirmButton: true,
			cancelButtonColor: '#B91817',
			cancelButtonText: 'NÃO',
			confirmButtonColor: '#B91817',
			confirmButtonText: 'SIM'
		}).then(function(result) { 
			if (result.value !== undefined && result.value === true)
				window.open("https://policies.reebokclub.com.br/#!//policy/booking");
		});
	});
});	

/*
|------------------------------------------------------------------------------
| Tela :: Settings / Profile
|------------------------------------------------------------------------------
*/
appReebok.onPageInit('settings-profile', function(page) {
	var _settingsProfileXHRRequest = undefined;
	$('.page[data-page=settings-profile] form[name=profile]').validate({
		rules: {
			nickname: {
				required: true,
				maxlength: 30,
				minlength: 3,
			},
			height: {
				required: true,
				maxlength: 3,
				minlength: 2,
			},
			weight: {
				required: true,
				maxlength: 3,
				minlength: 2,
			},
		},
		messages: {
			nickname: {
				required: 'Informe seu apelido, ou como deseja ser chamado.',
				maxlength: 'Seu apelido não deve ter mais que 30 caracteres.',
				minlength: 'Seu apelido deve ter no minimo menos 3 caracteres.',
			},
			height: {
				required: 'Sua altura deve ser informada corretamente.',
				maxlength: 'Sua altura deve ser informada corretamente.',
				minlength: 'Sua altura deve ser informada corretamente.',
			},
			weight: {
				required: 'Seu peso deve ser informado corretamente.',
				maxlength: 'Seu peso deve ser informado corretamente.',
				minlength: 'Seu peso deve ser informado corretamente.',
			},
		},
		onkeyup: false,
		errorElement : 'div',
		errorPlacement: function(error, element) {
			error.appendTo(element.parent().siblings('.input-error'));
		},
		submitHandler: function(form) {
			if (_settingsProfileXHRRequest != undefined) {
				try {
					_settingsProfileXHRRequest.abort();	
				}
				catch(_exception){
					console.log(_exception);
				}
			}
			_settingsProfileXHRRequest = $.ajax({
				url : $(form).attr('action'),
		        type : $(form).attr('method'),
		        data : $(form).serialize(),
		        beforeSend: function() {
		        	appReebok.Processing.Show();
		        },
		        error : function(xhr, ajaxOptions, thrownError) {
		        	if (thrownError == 'abort') return;
					swal({
						title: 'Atenção',
						html: "Houve um erro interno e a ação não pode ser realizada.<br/><br/>Tente novamente....",
						type: 'warning',
						confirmButtonColor: '#B91817',
						confirmButtonText: 'Ok'
					}).then(function(result) { 
						setTimeout(function(){
							appReebok.Reload();
						},250);
					});
		        },
		        success : function(data, textStatus, jqXHR) {
		        	if (data.success === undefined || data.success === false) {
		        		swal({
	        				timer: 2000,
							title: (data.message !== undefined && data.message.title !== undefined ? data.message.title :  'FALHA NA SOLICITAÇÃO'),
							html: (data.message !== undefined && data.message.html !== undefined ? data.message.html :  'Houve um ou mais erros relacionados a atualização de suas informações.<br/><br/>Tente novamente...'),
							type: 'error',
							showCancelButton: false,
							showConfirmButton: false,
						}).then(function(result) { 
							setTimeout(function(){
								appReebok.Reload();
							},250);	
						});
		        	}
		        	else {
		        		swal({
	        				timer: 2000,
							title: (data.message !== undefined && data.message.title !== undefined ? data.message.title :  'INFORMAÇÕES ATUALIZADAS'),
							html: (data.message !== undefined && data.message.html !== undefined ? data.message.html :  'Suas informações foram atualizadas com sucesso.'),
							type: 'success',
							showCancelButton: false,
							showConfirmButton: false,
						}).then(function(result) { 
							setTimeout(function(){
								appReebok.Back();
							},250);	
						});
		        	}
		        }
		    });	
		}
	});
});	

/*
|------------------------------------------------------------------------------
| Tela :: Settings / Biometric
|------------------------------------------------------------------------------
*/
appReebok.onPageInit('settings-biometric', function(page) {
	//:: Single Settings New Status
	var _settingsBiometricFingerprint = $('.page[data-page=settings-biometric] #fingerprint').is(":checked");
	var _settingsBiometricFaceRecognition = $('.page[data-page=settings-biometric] #face_recognition').is(":checked");
	//:: Single Settings Current Status
	var _settingsBiometricFingerprintStatus = $('.page[data-page=settings-biometric] #fingerprint').data("status");
		_settingsBiometricFingerprintStatus = (_settingsBiometricFingerprintStatus == '1' ? true : false);
	var _settingsBiometricFaceRecognitionStatus = $('.page[data-page=settings-biometric] #face_recognition').data("status");
		_settingsBiometricFaceRecognitionStatus = (_settingsBiometricFaceRecognitionStatus == '1' ? true : false);
	//:: Call to update Settings
	$('.page[data-page=settings-biometric] input[type=checkbox]').change(function () {
		_settingsBiometricFingerprint = $('.page[data-page=settings-biometric] #fingerprint').is(":checked");
		_settingsBiometricFaceRecognition = $('.page[data-page=settings-biometric] #face_recognition').is(":checked");
	});
	var _settingsBiometricXHRRequest = undefined;
	var _settingsBiometricXHREvent = function(URL, Method) {
		if (_settingsBiometricXHRRequest != undefined) {
			try {
				_settingsBiometricXHRRequest.abort();	
			}
			catch(_exception){
				console.log(_exception);
			}
		}
		_settingsBiometricXHRRequest = $.ajax({
	        url : URL,
	        type : Method,
	        data : {
	        	fingerprint: (_settingsBiometricFingerprint == true ? 1: 0),
	        	face_recognition: (_settingsBiometricFaceRecognition == true ? 1 : 0),
	        },
	        beforeSend: function() {
	        	appReebok.Processing.Show();
	        },
	        error : function(xhr, ajaxOptions, thrownError) {
	        	if (thrownError == 'abort') return;
				swal({
					title: 'Atenção',
					html: "Houve um erro interno e a ação não pode ser realizada.<br/><br/>Tente novamente....",
					type: 'warning',
					confirmButtonColor: '#B91817',
					confirmButtonText: 'Ok'
				}).then(function(result) { 
					setTimeout(function(){
						appReebok.Reload();
					},250);
				});
	        },
	        success : function(data, textStatus, jqXHR) {
	        	if (data.success === undefined || data.success === false) {
	        		swal({
        				timer: 2000,
						title: (data.message !== undefined && data.message.title !== undefined ? data.message.title :  'FALHA NA SOLICITAÇÃO'),
						html: (data.message !== undefined && data.message.html !== undefined ? data.message.html :  'Houve um ou mais erros relacionados a atualização da sua permissão de utilização de seus dados biométricos.<br/><br/>Tente novamente...'),
						type: 'error',
						showCancelButton: false,
						showConfirmButton: false,
					}).then(function(result) { 
						setTimeout(function(){
							appReebok.Reload();
						},250);	
					});
	        	}
	        	else {
	        		var _settingsBiometricFingerprintTimer = 0;
	        		var _settingsBiometricFingerprintButton = false;	        		
	        		var _settingsBiometricFingerprintMessage = '';
	        		if (_settingsBiometricFingerprint == true && _settingsBiometricFingerprintStatus == false)  {
	        			_settingsBiometricFingerprintTimer = 8000;
	        			_settingsBiometricFingerprintButton = true;
	        			_settingsBiometricFingerprintMessage = '<br/><br/>Para que você possa voltar a utilizar suas digitais junto aos sistemas da <b>Reebok Sports Club</b>, solicite na recepção de qualquer unidade o recadastramento biométrico.'
	        		}
	        		swal({
        				timer: 2000 + _settingsBiometricFingerprintTimer,
						title: (data.message !== undefined && data.message.title !== undefined ? data.message.title :  'PERMISSÕES ATUALIZADAS'),
						html: (data.message !== undefined && data.message.html !== undefined ? data.message.html :  'Sua permissão de utilização de seus dados biométricos foram atualizados com sucesso.') + _settingsBiometricFingerprintMessage,
						type: 'success',
						showCancelButton: false,
						showConfirmButton: _settingsBiometricFingerprintButton,
						confirmButtonColor: '#B91817',
						confirmButtonText: 'OK'
					}).then(function(result) { 
						setTimeout(function(){
							appReebok.Back();
						},250);	
					});
	        	}
	        }
	    });	
	}
	var _settingsBiometricRequest = undefined;
	var _settingsBiometricMethod = undefined;
	$('.page[data-page=settings-biometric] #submit').click(function(e) {
		e.preventDefault();
		//
		_settingsBiometricRequest = $(this).data('request'); 
		_settingsBiometricMethod = $(this).data('method');
		_settingsBiometricFingerprint = $('.page[data-page=settings-biometric] #fingerprint').is(":checked");
		_settingsBiometricFaceRecognition = $('.page[data-page=settings-biometric] #face_recognition').is(":checked");
		_settingsBiometricFingerprintStatus = $('.page[data-page=settings-biometric] #fingerprint').data("status");
		_settingsBiometricFingerprintStatus = (_settingsBiometricFingerprintStatus == '1' ? true : false);
		_settingsBiometricFaceRecognitionStatus = $('.page[data-page=settings-biometric] #face_recognition').data("status");
		_settingsBiometricFaceRecognitionStatus = (_settingsBiometricFaceRecognitionStatus == '1' ? true : false);
		//
		if (_settingsBiometricFingerprint == false && _settingsBiometricFingerprintStatus == true && _settingsBiometricFaceRecognition == false && _settingsBiometricFaceRecognitionStatus == true) {
			swal({
				title: 'ATENÇÃO',
				html: 'Você esta solicitando que nenhuma informação biométrica seja processada e armazenada nos sistemas da <b>Reebok Sports Club</b>.<br/>Isto irá efetuar a exclusão de todos os dados já existentes e relacionados a suas digitais, além de impedir que elas sejam coletadas novamente.<br/>Tal como, irá inibir todo e qualquer processamento de sua foto para fins de reconhecimento facial.<br/><br/>Se tem certeza de sua opção e deseja continuar, clique em <b>SIM</b>.',
				type: 'warning',
				showCancelButton: true,
				showConfirmButton: true,
				cancelButtonColor: '#B91817',
				cancelButtonText: 'CANCELAR',
				confirmButtonColor: '#B91817',
				confirmButtonText: 'SIM'
			}).then(function(result) {
				if (result.value !== undefined && result.value === true)
					_settingsBiometricXHREvent(_settingsBiometricRequest,_settingsBiometricMethod);
			});
		}
		else if (_settingsBiometricFaceRecognition == false && _settingsBiometricFaceRecognitionStatus == true) {
			swal({
				title: 'ATENÇÃO',
				html: 'Você esta solicitando que sua foto não seja processada pelos sistemas da <b>Reebok Sports Club</b> para fins de reconhecimento facial.<br/>Isto irá manter sua foto em nosso cadastro, contudo, ela não será mais processada para que o reconhecimento facial seja efetuado nos terminais dedicados junto a entrada das unidades.<br/><br/>Se tem certeza de sua opção e deseja continuar, clique em <b>SIM</b>.',
				type: 'warning',
				showCancelButton: true,
				showConfirmButton: true,
				cancelButtonColor: '#B91817',
				cancelButtonText: 'CANCELAR',
				confirmButtonColor: '#B91817',
				confirmButtonText: 'SIM'
			}).then(function(result) {
				if (result.value !== undefined && result.value === true)
					_settingsBiometricXHREvent(_settingsBiometricRequest,_settingsBiometricMethod);
			});
		}
		else if (_settingsBiometricFingerprint == false && _settingsBiometricFingerprintStatus == true) {
			swal({
				title: 'ATENÇÃO',
				html: 'Você esta solicitando que suas digitais não sejam processadas e armazenadas nos sistemas da <b>Reebok Sports Club</b>.<br/>Isto irá efetuar a exclusão de todos os dados já existentes e relacionados a suas digitais, além de impedir que elas sejam coletadas novamente.<br/><br/>Se tem certeza de sua opção e deseja continuar, clique em <b>SIM</b>.',
				type: 'warning',
				showCancelButton: true,
				showConfirmButton: true,
				cancelButtonColor: '#B91817',
				cancelButtonText: 'CANCELAR',
				confirmButtonColor: '#B91817',
				confirmButtonText: 'SIM'
			}).then(function(result) { 
				if (result.value !== undefined && result.value === true)
					_settingsBiometricXHREvent(_settingsBiometricRequest,_settingsBiometricMethod);
			});
		}
		else
			_settingsBiometricXHREvent(_settingsBiometricRequest,_settingsBiometricMethod);
	});
});	

/*
|------------------------------------------------------------------------------
| Tela :: Settings / Notifications
|------------------------------------------------------------------------------
*/
appReebok.onPageInit('settings-notification', function(page) {
	var _settingsNotificationSMS = $('.page[data-page=settings-notification] #sms').is(":checked");
	var _settingsNotificationPush = $('.page[data-page=settings-notification] #push').is(":checked");
	var _settingsNotificationMail = $('.page[data-page=settings-notification] #mail').is(":checked");
	var _settingsNotificationWhatsApp = $('.page[data-page=settings-notification] #whatsapp').is(":checked");
	$('.page[data-page=settings-notification] input[type=checkbox]').change(function () {
		_settingsNotificationSMS = $('.page[data-page=settings-notification] #sms').is(":checked");
		_settingsNotificationPush = $('.page[data-page=settings-notification] #push').is(":checked");
		_settingsNotificationMail = $('.page[data-page=settings-notification] #mail').is(":checked");
		_settingsNotificationWhatsApp = $('.page[data-page=settings-notification] #whatsapp').is(":checked");
	});
	var _settingsNotificationXHRRequest = undefined;
	var _settingsNotificationXHREvent = function(URL, Method) {
		if (_settingsNotificationXHRRequest != undefined) {
			try {
				_settingsNotificationXHRRequest.abort();	
			}
			catch(_exception){
				console.log(_exception);
			}
		}
		_settingsNotificationXHRRequest = $.ajax({
	        url : URL,
	        type : Method,
	        data : {
	        	sms: (_settingsNotificationSMS == true ? 1: 0),
	        	push: (_settingsNotificationPush == true ? 1 : 0),
	        	mail: (_settingsNotificationMail == true ? 1 : 0),
	        	whatsapp: (_settingsNotificationWhatsApp == true ? 1 : 0),
	        },
	        beforeSend: function() {
	        	appReebok.Processing.Show();
	        },
	        error : function(xhr, ajaxOptions, thrownError) {
	        	if (thrownError == 'abort') return;
				swal({
					title: 'Atenção',
					html: "Houve um erro interno e a ação não pode ser realizada.<br/><br/>Tente novamente....",
					type: 'warning',
					confirmButtonColor: '#B91817',
					confirmButtonText: 'Ok'
				}).then(function(result) { 
					setTimeout(function(){
						appReebok.Reload();
					},250);
				});
	        },
	        success : function(data, textStatus, jqXHR) {
	        	if (data.success === undefined || data.success === false) {
	        		swal({
        				timer: 2000,
						title: (data.message !== undefined && data.message.title !== undefined ? data.message.title :  'FALHA NA SOLICITAÇÃO'),
						html: (data.message !== undefined && data.message.html !== undefined ? data.message.html :  'Houve um ou mais erros relacionados a atualização da sua permissão de notificação.<br/><br/>Tente novamente...'),
						type: 'error',
						showCancelButton: false,
						showConfirmButton: false,
					}).then(function(result) { 
						setTimeout(function(){
							appReebok.Reload();
						},250);	
					});
	        	}
	        	else {
	        		swal({
        				timer: 2000,
						title: (data.message !== undefined && data.message.title !== undefined ? data.message.title :  'PERMISSÕES ATUALIZADAS'),
						html: (data.message !== undefined && data.message.html !== undefined ? data.message.html :  'Sua permissão de notificação foi atualizada com sucesso.'),
						type: 'success',
						showCancelButton: false,
						showConfirmButton: false
					}).then(function(result) { 
						setTimeout(function(){
							appReebok.Back();
						},250);	
					});
	        	}
	        }
	    });	
	}
	var _settingsNotificationRequest = undefined;
	var _settingsNotificationMethod = undefined;
	$('.page[data-page=settings-notification] #submit').click(function(e) {
		e.preventDefault();
		_settingsNotificationRequest = $(this).data('request'); 
		_settingsNotificationMethod = $(this).data('method');
		_settingsNotificationXHREvent(_settingsNotificationRequest,_settingsNotificationMethod);
	});
});

/*
|------------------------------------------------------------------------------
| Form
|------------------------------------------------------------------------------
*/
appReebok.onPageInit('form', function(page) {
	var _formRequest = undefined;
	$('.page[data-page=form] .button-confirm').click(function(e){
		e.preventDefault();
		
		var _formDBID = $(this).data('form');
		var _formURL = $(this).data('request');
		var _formMethod = $(this).data('method');
		var _formField = undefined;
		var _formIsValid = true;
		//
		var _formCheckField = 0;
		$('.page[data-page=form] .list-field').each(function(){
			_formCheckField++;
			var _formFieldValue =  $('.page[data-page=form] input[name=option_' + _formCheckField + ']:checked').val();
			if (_formFieldValue == undefined && _formIsValid == true) {
				_formField = $('.page[data-page=form] .list-field_' + _formCheckField);
				_formIsValid = false;
				console.log(_formField);
				console.log(_formFieldValue);
			}
			
			
		});
		if (_formIsValid === false){
			swal({
				title: 'Atenção',
				html: "Um ou mais questões não foram respondidas!!!<br/>Por favor, revise e tente novamente...",
				type: 'warning',
				confirmButtonColor: '#B91817',
				confirmButtonText: 'Ok'
			}).then(function(result) {
				$('.page-content').animate({
                    scrollTop: $(_formField).offset().top - 56
                }, 1000);
			});	
		} else {
			var _formData = {
				'form': _formDBID,
				'fields': []
			};
			var _formDataField = 0;
			$('.page[data-page=form] .list-field').each(function(){
				_formDataField++;
				_formData.fields.push({
					'dbid': $(this).data('field'),
					'value': $('.page[data-page=form] input[name=option_' + _formDataField + ']:checked').val()
				});
			});
			
			if (_formRequest !== undefined){
				try {
					_formRequest.abort()
				}
				catch (_Exception) {
					console.log(_Exception);
				}
			}
			_formRequest = $.ajax({
		        url : _formURL,
		        type : _formMethod,
		        data : _formData,
		        beforeSend: function() {
		        	appReebok.Processing.Show();
		        },
		        complete: function() { },
		        error : function(xhr, ajaxOptions, thrownError) {
		        	if (thrownError == 'abort')  
		        		return;
		        	appReebok.Processing.Hide();
		        },
		        success : function(data, textStatus, jqXHR) {
		        	if (data.success !== undefined && data.success == true) {
		        		swal({
							timer: 3000,
							title: (data.message !== undefined && data.message.title !== undefined ? data.message.title : 'Dados Atualizados'),
							html: (data.message !== undefined && data.message.html !== undefined ? data.message.html : 'Suas respostas foram recebidas e armazenadas com sucesso.'),
							type: 'success',
							showDenyButton: false,
							showCloseButton: false,
							showCancelButton: false,
							confirmButtonColor: '#B91817',
							confirmButtonText: 'Ok'
						}).then(function(result) {
							appReebok.Load({
								url: data.goto
							});
						});			        		
		        	}
		        	else {
		        		swal({
							title: (data.message !== undefined && data.message.title !== undefined ? data.message.title : 'Erro de Processamento'),
							html: (data.message !== undefined && data.message.html !== undefined ? data.message.html : 'Não foi possível enviar suas respostas neste momento.<br/><br/>Tente novamente...'),
							type: 'warning',
							showDenyButton: false,
							showCloseButton: false,
							showCancelButton: false,
							confirmButtonColor: '#B91817',
							confirmButtonText: 'Ok'
						}).then(function(result) {});	
			        	appReebok.Processing.Hide();
		        	}     		
		        }
		    });	
		}
	});
});
