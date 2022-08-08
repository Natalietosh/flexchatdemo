jQuery(window).ready(()=> {
          const appConfig = {
            accountSid: "AC93273397dd3570e92c2aaded35f8e135",
            flexFlowSid: "FO15745a46bc53a83256f0c1d57393fa43",
           context: {
            friendlyName: /* is logged in ? then = Jennifer Smith, else = anonymous */
           },
           startEngagementOnInit: true
          };
            console.log('Twilio Web Chat');
          Twilio.FlexWebChat.createWebChat(appConfig)
                .then(webchat => {
                    const { manager } = webchat;
                  Twilio.FlexWebChat.Actions.on("afterToggleChatVisibility", () => {
                    const {channelSid} = manager.store.getState().flex.session;
                    manager
                      .chatClient.getChannelBySid(channelSid)
                      .then(channel => {
                        console.log(channel.sid);
                        let visitor = new GLANCE.Presence.Visitor({
                          groupid: document.getElementById("glance-cobrowse").getAttribute("data-groupid"),
                          visitorid: channel.sid
                        });
                        visitor.onerror = function (e) {
                          console.log("presence error:", e);
                        };
                        visitor.presence({
                          data: {mydata: "abc", myotherdata: 99999},
                          onsuccess: function () {
                            console.log("presence success");
                          }
                          // errors will be reported through onerror event
                        });
                        visitor.onsignal = function (msg) {
                          console.log("received signal:", e);
                        };
                        visitor.connect(); // not sure this is needed now because .presence() connects
                      });
                  });
                  webchat.init();
                });
});
