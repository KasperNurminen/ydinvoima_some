
function sendMessage(ele) {
    if (event.key == "Enter") {
        var msg_ele = document.createElement("div")
        var ele_txt = document.createTextNode(ele.value)
        msg_ele.appendChild(ele_txt)
        msg_ele.classList.add("speech-bubble")
        msg_ele.classList.add("right")
        var container = document.getElementById("messages_container")
        container.appendChild(msg_ele)
        container.scrollTop = container.scrollHeight;
        window.setTimeout(respond, 1000)
        ele.value = ""
    }
}
function respond() {
    var container = document.getElementById("messages_container")
    var ele_txt = document.createTextNode("No moi!")
    if (container.children.length == 3) {
        ele_txt = document.createTextNode("Sori en ehi jutteleen pidempään, pitää mennä!")
    }
    console.log(container.children.length)
    if (container.children.length < 4) {
        var msg_ele = document.createElement("div")

        msg_ele.appendChild(ele_txt)
        msg_ele.classList.add("speech-bubble")

        container.appendChild(msg_ele)
        container.scrollTop = container.scrollHeight;
    }

}
function closeMessage() {
    console.log("closing")
    document.getElementById("message").style.display = "none"
}
function openChat(elem) {
    document.getElementById("messages_container").innerHTML = '';
    document.getElementById("message_top").innerHTML = elem.children[1].innerHTML
    document.getElementById("message").style.display = "block"
}

