'use strict';
(function() {
	
	
});
/*
|------------------------------------------------------------------------------
| Funções
|------------------------------------------------------------------------------
*/
function countdown(element, callback){
	/* Verificando se o element é undefined */
	if (element === undefined) 
		element = $('.countdown-timer'); 
	/* Recuperando elemento do countdown */
	var _countdownElement = $(element);
	/* Verificando se o elemento foi encontrado */
	if (_countdownElement.length) {
		/* Recuperando dada do countdown */	
		var _countdownValue = $(_countdownElement).data('countdown');
			_countdownValue = _countdownValue.replace(' ','T');
		/* Convert a data informada em timedate */
		var _countdownTarget = new Date(_countdownValue).getTime();
		/* Armazenando função do callback */
		var _countdownCallback = typeof callback === "function" ? callback : undefined;
		/* Atualiza o contador a cada 1 segundo */
		var _countdownTimer = setInterval(function() {
			/* Recuperando horario atual */
			var _countdownNow = new Date().getTime();
 			/* Calculando diferente de horarios, alvo - atual */
			var _countdownDuration = _countdownTarget - _countdownNow;
			/* Calculando dias, horas, minutos e segundos */
			var _countdownDays = Math.floor(_countdownDuration / (1000 * 60 * 60 * 24));
				_countdownDays = _countdownDays < 10 ? '0' + _countdownDays : _countdownDays;
			var _countdownHours = Math.floor((_countdownDuration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
				_countdownHours = _countdownHours < 10 ? '0' + _countdownHours : _countdownHours;
			var _countdownMinutes = Math.floor((_countdownDuration % (1000 * 60 * 60)) / (1000 * 60));
				_countdownMinutes = _countdownMinutes < 10 ? '0' + _countdownMinutes : _countdownMinutes;
			var _countdownSeconds = Math.floor((_countdownDuration % (1000 * 60)) / 1000);
				_countdownSeconds = _countdownSeconds < 10 ? '0' + _countdownSeconds : _countdownSeconds;
			/* Atualizando display */
			if (_countdownDays <= 0)
				$(_countdownElement).find('.days').hide();
			else
				$(_countdownElement).find('.days').show();
			$(_countdownElement).find('.days .value').text(_countdownDays);
			$(_countdownElement).find('.hours .value').text(_countdownHours);
			$(_countdownElement).find('.minutes .value').text(_countdownMinutes);
			$(_countdownElement).find('.seconds .value').text(_countdownSeconds);
			/* Verificando se o display NÃO esta visivel */
			if ($(_countdownElement).is(':visible') == false)
				$(_countdownElement).show()
			/* Se a contagem expirou, executar função definida em onFinish */
			if (_countdownDuration < 0) {
				clearInterval(_countdownTimer);
				if (_countdownCallback !== undefined)
					_countdownCallback();
				else
					appReebok.Reload()
			}
		}, 1000);
	}
}