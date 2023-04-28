'use strict';
appReebok.onPageInit('*', function(page) {
	/*
	 * ------------------------------------------------------------------------------
	 * Side Panel
	 * ------------------------------------------------------------------------------
	 */
	$$('.panel-left').on('open', function() {
		$$('.hamburger').addClass('is-active');
	});
	$$('.panel-left').on('close', function() {
		$$('.hamburger').removeClass('is-active');
	});
	/*
	 * ------------------------------------------------------------------------------
	 * Tooltip
	 * ------------------------------------------------------------------------------
	 */
	$('[title]').tooltipster({
		theme : 'tooltipster-borderless'
	});
	$('[data-tooltip-content]').tooltipster({
		interactive : true,
		theme : 'tooltipster-borderless'
	});
});
/*
 * ------------------------------------------------------------------------------
 * Helpers
 * ------------------------------------------------------------------------------
 */
Dom7.nl2br = function(str) {
	return str.replace(/(\r\n|\n\r|\r|\n)/g, '<br>');
};
Dom7.br2nl = function(str) {
	return str.replace(/<br>/g, '\r');
};
/*
 * ------------------------------------------------------------------------------
 * Complemento ao jQuery :: Bootstrap Modals
 * ------------------------------------------------------------------------------
 */
(function($) {
	$.fn.modal.Constructor.prototype.fullSize = function() {
		var _self = this;
		var _margin = 10;
		var _window_x = $(window).width();
		var _window_y = $(window).height();
		var _modals_y = _window_y - (_margin * 2);
		var _modals_header_y = $(this.$element).find('.modal-header')
				.outerHeight(true);
		_modals_header_y = (_modals_header_y == 0 || _modals_header_y == undefined ? $(this.$element).find('.modal-header').height() : _modals_header_y);
		var _modals_footer_y = $(this.$element).find('.modal-footer').outerHeight(true);
		_modals_footer_y = (_modals_footer_y == 0 || _modals_footer_y == undefined ? $(this.$element).find('.modal-footer').height() : _modals_footer_y);
		var _modals_body_y = _window_y - ((_margin * 2) + (_modals_header_y === undefined ? 0 : _modals_header_y) + (_modals_footer_y === undefined ? 0 : _modals_footer_y));
		$(this.$element).find('.modal-dialog').css('min-height', _modals_y + 'px');
		$(this.$element).find('.modal-dialog').find('.modal-content').css('min-height', _modals_y + 'px');
		if ($(this.$element).is(':visible')) {
			$(this.$element).find('.modal-dialog').find('.modal-content').find('.modal-body').css('min-height', _modals_body_y + 'px');
		}
		if ($(this.$element).data('fitToWindow') === undefined) {
			$(this.$element).data('fitToWindow', 'init')
			$(this.$element).on('show.bs.modal', function() {
				$(this).modal('fitToWindow');
			});
			$(this.$element).on('shown.bs.modal', function() {
				$(this).modal('fitToWindow');
			});
			$(window).on("resize", function() {
				$(_self.$element).modal('fitToWindow');
			});
		}
	};
})(jQuery);