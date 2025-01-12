(function() {
    var config = window.embeddedComponentConfig || {};
    var container = document.getElementById('embedded-component');
    if (container) {
        var htmlContent = `
            <div style="background-color: ${config.bgColor}; padding: 20px;">
                <h2>${config.chatbotName}</h2>
                <p>${config.description}</p>
                <img src="${config.avatarImg}" alt="Avatar" style="width: 50px; height: 50px;">
                <img src="${config.companyLogo}" alt="Company Logo" style="width: 50px; height: 50px;">
                <p>Company: ${config.companyName}</p>
                <p>Bot ID: ${config.botId}</p>
                <p>Temperature: ${config.temperature}</p>
                <button onclick="${config.onClose}">Close</button>
            </div>
        `;
        container.innerHTML = htmlContent;
    }
})();
