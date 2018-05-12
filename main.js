moment.locale("fi")
var database = firebase.database();

window.onload = updatePosts()

function updatePosts(e) {
    database.ref('/').once('value')
        .then(function (data) {
            var data_array = []
            var data_val = data.val()
            for (var key in data_val) {
                console.log(key)
                data_array.push(data_val[key])
            }

            console.log(data_array)
            for (post of data_array) {
                createPost(post.author, post.message, post.date, post.thumbs, post.src)

            }
        })

}

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
function openChat(ele) {
    document.getElementById("messages_container").innerHTML = '';
    document.getElementById("message_top").innerHTML = ele.children[1].innerHTML
    document.getElementById("message").style.display = "block"
}
function createPost(author, msg, time, thumbs, src) {

    var msg_ele = document.createElement("div")
    var ele_txt = document.createTextNode(msg)
    var date = moment(time).calendar()
    msg_ele.innerHTML = '<div class="author"><img class="post_avatar" src = "http://fuuse.net/wp-content/uploads/2016/02/avatar-placeholder.png" >\
                <div class="author_name">' + author + '\
                            <br>\
                        <i>' + date + '</i>\
                        </div>\
                </div>'

    msg_ele.appendChild(ele_txt)
    if (src) {
        msg_ele.innerHTML += ' <img class="post_image" src="http://www.industrialprime.fi/industrialprime_fi/wp-content/uploads/2014/03/ydinvoima.jpg">'
    }
    msg_ele.innerHTML += '<br/><input type="text" onkeydown="newPost(this)" id="comment_field" placeholder="Kommentoi..." /><div id="thumbs"><i onClick="addKarma(this)" class="fas fa-chevron-up fa-2x pointer" ></i ><i onClick="substractKarma(this)" class="fas fa-chevron-down fa-2x pointer"></i><span>Peukkuja: ' + thumbs + ' </span></div >'
    msg_ele.classList.add("post")
    var container = document.getElementById("previous_posts")
    container.prepend(msg_ele)


}
function newPost(ele) {
    if (event.key == "Enter") {

        var linkData = {
            "author": "Ykä Ydinvoimamies",
            "message": ele.value,
            "date": new Date().toISOString(),
            "thumbs": 0
        }


        database.ref().push(linkData);
        updatePosts()
        /*var msg_ele = document.createElement("div")
        var ele_txt = document.createTextNode(ele.value)
        msg_ele.innerHTML = '<div class="author"><img class="post_avatar" src = "http://fuuse.net/wp-content/uploads/2016/02/avatar-placeholder.png" >\
                <div class="author_name"> Ykä Ydinvoimamies\
                            <br>\
                        <i>Juuri äsken </i>\
                        </div>\
                </div>'
        msg_ele.appendChild(ele_txt)
        msg_ele.innerHTML += '<div id="thumbs"><i onClick="addKarma(this)" class="fas fa-chevron-up fa-2x pointer" ></i ><i onClick="substractKarma(this)" class="fas fa-chevron-down fa-2x pointer"></i><span>Peukkuja: 0 </span></div >'
        msg_ele.classList.add("post")
        var container = document.getElementById("previous_posts")
        container.prepend(msg_ele)*/
        // add karma
        var karmacount = document.getElementById("karmacount")
        karmacount.innerHTML = parseInt(karmacount.innerHTML) + 20

        // clear the input element
        ele.value = ""
    }
}
function addKarma(ele) {
    console.log(ele.parentElement.children)
    var prevPoints = ele.parentElement.children[ele.parentElement.children.length - 1]
    console.log(parseInt(prevPoints.innerHTML.replace(/[^0-9.]/g, "")) + 1)
    prevPoints.innerHTML = "Peukkuja: " + (parseInt(prevPoints.innerHTML.replace(/[^0-9.]/g, "")) + 1)
    //disable the button
    ele.style.pointerEvents = "none";
    ele.style.color = "grey";
    // enable other button
    ele.parentElement.children[1].style.color = "black";
    ele.parentElement.children[1].style.pointerEvents = "all";

    //increment karma
    var karmacount = document.getElementById("karmacount")
    karmacount.innerHTML = parseInt(karmacount.innerHTML) + 10
}
function substractKarma(ele) {
    console.log(ele.parentElement.children)
    var prevPoints = ele.parentElement.children[ele.parentElement.children.length - 1]
    console.log(parseInt(prevPoints.innerHTML.replace(/[^0-9.]/g, "")) + 1)
    prevPoints.innerHTML = "Peukkuja: " + (parseInt(prevPoints.innerHTML.replace(/[^0-9.]/g, "")) - 1)
    ele.style.pointerEvents = "none";
    ele.style.color = "grey";
    ele.parentElement.children[0].style.color = "black";
    ele.parentElement.children[0].style.pointerEvents = "all";

    //decrement karma
    var karmacount = document.getElementById("karmacount")
    karmacount.innerHTML = parseInt(karmacount.innerHTML) - 10
}
function closeHappeningDialog() {
    document.getElementById("dialog").style.display = "none"
}
function openHappening(ele) {
    var name = ele.children[1].innerHTML.split(" ")[0]
    console.log(name)
    //document.getElementById("message_top").innerHTML = ele.children[1].innerHTML
    document.getElementById("dialog").style.display = "block"
    document.getElementById("happeningName").innerHTML = name
}