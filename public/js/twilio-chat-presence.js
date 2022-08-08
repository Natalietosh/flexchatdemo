jQuery(window).ready(()=> {
  const appConfig = {
    accountSid: "AC93273397dd3570e92c2aaded35f8e135",
    flexFlowSid: "FO15745a46bc53a83256f0c1d57393fa43",
    startEngagementOnInit: true
  };

  let sessionid = undefined;

  Twilio.FlexWebChat.createWebChat(appConfig)
    .then(webchat => {
      const { manager } = webchat;

      Twilio.FlexWebChat.Actions.on("afterSendMessage", () => {
        const {channelSid} = manager.store.getState().flex.session;
        if (!sessionid || sessionid !== channelSid) {
          manager
            .chatClient.getChannelBySid(channelSid)
            .then(channel => {
              let visitor = new GLANCE.Presence.Visitor({
                groupid: document.getElementById("glance-cobrowse").getAttribute("data-groupid"),
                visitorid: channel.sid
              });
              visitor.onerror = function (e) {
                console.log("presence error:", e);
              };
              visitor.presence({
                onsuccess: function () {
                  console.log("presence success");
                }
              });
              visitor.onsignal = function (msg) {
                console.log("received signal:", msg);
              };
              visitor.connect();

            });
          sessionid = channelSid;
        }
      });

      webchat.init();

    });
});
