var _serviceWorkderVersion = '1.1.0';
var _serviceWorkerFilepath = '/assets/custom/sw/firebase-messaging-sw.js?version=' + _serviceWorkderVersion;
/**
 * Firebase Settings
 */
var _firebaseSettings = {
    apiKey: "AIzaSyAdwH62Gw6Rj_81m8cuEnXzYsKcuUHHWyQ",
    authDomain: "reebok-sports-club.firebaseapp.com",
    databaseURL: "https://reebok-sports-club.firebaseio.com",
    projectId: "reebok-sports-club",
    storageBucket: "reebok-sports-club.appspot.com",
    messagingSenderId: "195531984432",
    appId: "1:195531984432:web:931cf1c7f63ac584fbe7f5"
    //measurementId: "G-EBLJFDWE09"
};
/**
 * Firebase APP
 */
firebase.initializeApp(_firebaseSettings);
/**
 * Firebase Analytics
 */
firebase.analytics();
firebase.analytics().logEvent('session_start');
/**
 * We can start _firebaseMessaging using _firebaseMessaging() service with firebase object
 */
var _firebaseMessaging = firebase.messaging();
var _firebaseServiceWorker = undefined;
/**
 * Register your service worker here It starts listening to incoming push
 * notifications from here
 */
navigator.serviceWorker.register(_serviceWorkerFilepath).then(function (registration) {
	/**
	 * Firebase Analytics LOG
	 */
	firebase.analytics().logEvent('sw_register_success',{
		version: _serviceWorkderVersion
	});
    console.log('[firebase.js] Success in service worker register');
    /**
	 * Since we are using our own service worker ie firebase-_firebaseMessaging-sw.js
	 * file
	 */
    _firebaseMessaging.useServiceWorker(registration);
    _firebaseServiceWorker = registration;
	/** Lets request user whether we need to send the notifications or not */
    _firebaseMessaging.requestPermission().then(function () {
    	/** Standard function to get the token */
        _firebaseMessaging.getToken().then(function(token) {
        	/**
        	 * Firebase Analytics LOG
        	 */
        	firebase.analytics().logEvent('messaging_request_permission_success',{
        		token: token
        	});
        	console.log('[firebase.js] Success on fetching the token: ' + token);
        	/**
        	 * Request save token on app database
        	 */
        	firebaseMessagingSaveToDB(token);
        }).catch(function(error) {
        	/**
        	 * Firebase Analytics LOG
        	 */
        	firebase.analytics().logEvent('messaging_request_permission_failure',{
        		error: error
        	});
	        console.log('[firebase.js] Error while fetching the token:');
	        console.log(error);
	    });
    }).catch(function (error) {
    	/**
    	 * Firebase Analytics LOG
    	 */
    	firebase.analytics().logEvent('messaging_request_permission_denied',{
    		error: error
    	});
        console.log('[firebase.js] Permission denied:');
        console.log(error);
    });
}).catch(function (error) {
	/**
	 * Firebase Analytics LOG
	 */
	firebase.analytics().logEvent('sw_register_failed',{
		version: _serviceWorkderVersion
	});
	console.log('[firebase.js] Error in service worker register: ');
	console.log(error);
});
/** 
 * What we need to do when the existing token refreshes for a user 
 */
_firebaseMessaging.onTokenRefresh(function() {
    _firebaseMessaging.getToken().then(function(renewedToken) {
    	/**
    	 * Firebase Analytics LOG
    	 */
    	firebase.analytics().logEvent('messaging_token_refresh_success',{
    		token: renewedToken
    	});
    	console.log('[firebase.js] Success in fetching refreshed token: ' + renewedToken);
    	/**
    	 * Request save token on app database
    	 */
    	firebaseMessagingSaveToDB(renewedToken);
    }).catch(function(error) {
    	/**
    	 * Firebase Analytics LOG
    	 */
    	firebase.analytics().logEvent('messaging_token_refresh_failure',{
    		error: error
    	});
    	console.log('[firebase.js] Error in fetching refreshed token:');
    	console.log(error);
    });
});
/**
 * Handle incoming messages
 */
_firebaseMessaging.onMessage(function(payload) {
	/**
	 * Firebase Analytics LOG
	 */
	firebase.analytics().logEvent('messaging_on_message');
	console.log('[firebase.js] Received message:');
	console.log(payload);
	/**
	 * Processing Payload
	 */
	var _firebaseMessagingPayload = firebaseMessagingPayload(payload);
	var _firebaseMessagingReturns = null;
	/**
	 * Firebase Analytics LOG
	 */
	firebase.analytics().logEvent('messaging_on_receive_success',{
		payload: _firebaseMessagingPayload
	});
	/**
	 * Display notification
	 */
	try {
		/**
		 * Show notification
		 */
		_firebaseMessagingReturns = _firebaseServiceWorker.showNotification(_firebaseMessagingPayload.title, _firebaseMessagingPayload.options);
		/**
		 * Firebase Analytics LOG
		 */
		firebase.analytics().logEvent('messaging_show_notification_success');
		console.log('[firebase.js] Show notification success:');
		console.log(_firebaseMessagingPayload);
	}
	catch(_exception) {
		/**
		 * Firebase Analytics LOG
		 */
		firebase.analytics().logEvent('messaging_show_notification_failure',{
			exception: _exception
		});
		console.log('[firebase.js] Show notification failed:');
		console.log(_exception);
	}		
	/**
	 * Event returns
	 */
	return _firebaseMessagingReturns;
});
/**
 * Process Mensage Payload
 */
function firebaseMessagingPayload(Payload) {
	return {
		title: Payload.notification.title,
		options: {
			body: Payload.notification.body,
			icon: Payload.notification.icon,
			data: Payload.data,
			vibrate: [200, 100, 200, 100, 200, 100, 200]
		}
	};
}
/**
 * Save Key on Database Caller
 */
var _firebaseMessagingSaveToDBRequest = undefined;
function firebaseMessagingSaveToDB(Token) {
	if (_firebaseMessagingSaveToDBRequest != undefined) {
		try {
			_firebaseMessagingSaveToDBRequest.abort();	
		}
		catch(_exception){
			console.log(_exception);
		}
	}
	_firebaseMessagingSaveToDBRequest = $.ajax({
        url : '/token',
        type : 'POST',
        data : {
        	token: Token
        },
        beforeSend: function() { },
        error : function(xhr, ajaxOptions, thrownError) {
        	if (thrownError == 'abort') return;
        	/**
        	 * Firebase Analytics LOG
        	 */
        	firebase.analytics().logEvent('messaging_token_save_to_db_failure');
        	console.log('[firebase.js] Error in save token on database: ' + Token);
        },
        success : function(data, textStatus, jqXHR) {
        	/**
        	 * Firebase Analytics LOG
        	 */
        	firebase.analytics().logEvent('messaging_token_save_to_db_success',{
        		data: data
        	});
        	console.log('[firebase.js] Success in save token on database:');
        	console.log(data);
        }
    });	
}
/**
 * Broadcast message to channel
 */
var _firebaseMessagingBroadcast = new BroadcastChannel(_firebaseSettings.apiKey);
	_firebaseMessagingBroadcast.addEventListener('message', event => {
	console.log('[firebase.js] Receive broadcast message:');
	console.log(event);
	//
	var _client = undefined;
	var _clients = undefined;
	var _process = false;
	var _gotoURL = undefined;
	if (event.data !== undefined && event.data.type !== undefined) {
		if (event.data.type == 7) {
			_process = true;
			_gotoURL = '/activity/detail'
			_gotoURL = _gotoURL + '/' + event.data.area;
			_gotoURL = _gotoURL + '/' + event.data.class;
			_gotoURL = _gotoURL + '/' + event.data.date.split("-")[0];
			_gotoURL = _gotoURL + '/' + event.data.date.split("-")[1];
			_gotoURL = _gotoURL + '/' + event.data.date.split("-")[2];
			_gotoURL = _gotoURL + '/' + event.data.hour.split(":")[0];
			_gotoURL = _gotoURL + '/' + event.data.hour.split(":")[1];
			_gotoURL = _gotoURL + '/'
		}
	}
	console.log(_gotoURL);
	
});
/**
 * Requesting Notification Permission
 */
if ("Notification" in window) { 
	if (Notification.permission === "granted") { }
	else if (Notification.permission !== 'denied') {
		Notification.requestPermission().then(function(permission) {
		    if (!('permission' in Notification)) {
		        Notification.permission = permission;
		    }
		    // you got permission !
		}, function(rejection) { });
	}
}