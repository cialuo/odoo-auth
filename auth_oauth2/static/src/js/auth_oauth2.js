openerp.auth_oauth2 = function(instance) {

    //translation needs
    var _t = instance.web._t,
        _lt = instance.web._lt;

    //template instance
    var QWeb = instance.web.qweb;

    instance.web.Login = instance.web.Login.extend({

        is_oauth2_cnx: false,

        start: function() {
            var self = this;
            if(this.params.hasOwnProperty('loginerror')){
                var message = "Access Denied"
                if (this.params.hasOwnProperty('error')){
                    message = this.params.error;
                }
                self.$(".oe_login_pane").fadeIn("fast", function() {
                    self.show_error(_t(message));
                });
            }
            if(!this.params.hasOwnProperty('login,password')){
                cnx_form = this.$el.find('.oe_login_pane form > ul:last-child()');
                cnx_form.hide()
                $(QWeb.render('auth_oauth2.login')).insertAfter(cnx_form);
                this.is_oauth2_cnx = true;
            }
            return this._super();
        },

        on_submit: function(ev) {
            if(!this.is_oauth2_cnx){
                this._super(ev);
            }else{
                if(ev) {
                    ev.preventDefault();
                }
                this.hide_error();
                this.$(".oe_login_pane").fadeOut("slow");
                var db = this.$el.find("form [name=db]").val();
                this.do_oauth2_login(db);
            }
        },

        do_oauth2_login: function(db) {
            var self = this;
            this.rpc('/auth_oauth2/get_oauth2_auth_url', {'db': db}).done(
                function(result) {
                    if (result.error) {
                        self.do_warn(result.title, result.error);
                        return;
                    }
                    window.location.replace(result.value);
            });
        },
    });

};
