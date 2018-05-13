moment.locale("fi") // set moment language
var database = firebase.database(); // initialize database connection
var numOfPosts = 0
window.onload = updatePosts()

function updatePosts(e) {
    // updates the posts from firebase



    database.ref('/').once('value')
        .then(function (data) {
            document.getElementById("previous_posts").innerHTML = "" // clear previous
            // data = firebase data

            var data_val = data.val()


            numOfPosts = data_val.length
            console.log(numOfPosts)
            data_val.forEach(function (post, index) {
                createPost(post.author, post.message, post.date, post.thumbs, post.src, post.comments, index)

            })
        })

}

function sendMessage(ele) {
    // sends private messages
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
    // automatic responses to private messages
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
    document.getElementById("message").style.display = "none"
}
function openChat(ele) {
    document.getElementById("messages_container").innerHTML = '';
    document.getElementById("message_top").innerHTML = ele.children[1].innerHTML
    document.getElementById("message").style.display = "block"
}
function createPost(author, msg, time, thumbs, src, comments, index) {
    // creates a post to the UI
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
    if (comments) {
        var data_array = []
        for (var key in comments) {
            // turn it into a array
            data_array.push(comments[key])
        }

        for (comment of data_array) {
            msg_ele.innerHTML += `<div class="comments">
                <div class="comment ` + (comment.own ? "comment_reply" : "") + `">
                    <div class="comment_avatar">
                        <img src="http://fuuse.net/wp-content/uploads/2016/02/avatar-placeholder.png">
                        </div>
                        <div class="comment_body">
                            <div class="comment_info">` + comment.author + ` <i> ` + moment(comment.date).calendar() + `</i></div>
                            <p>` + comment.message + `</p>
                        </div>
                    </div>

                    



                    </div>`
        }
    }
    msg_ele.innerHTML += '<br/><input type="text" onkeydown="newComment(this,' + index + ')" id="comment_field" placeholder="Kommentoi..." /><div id="thumbs"><i onClick="addKarma(this)" class="fas fa-chevron-up fa-2x pointer" ></i ><i onClick="substractKarma(this)" class="fas fa-chevron-down fa-2x pointer"></i><span>Peukkuja: ' + thumbs + ' </span></div >'
    msg_ele.classList.add("post")
    var container = document.getElementById("previous_posts")
    container.prepend(msg_ele)


}
function newComment(ele, index) {
    if (event.key == "Enter") {
        var linkData = {
            "author": "Ykä Ydinvoimamies",
            "message": ele.value,
            "date": new Date().toISOString(),
            "own": true
        }
        database.ref("/" + index).child("comments").push(linkData);
        updatePosts()
    }
}
function newPost(ele) {
    // updates firebase, increases karma and runs updatePosts()
    if (event.key == "Enter") {

        var linkData = {
            "author": "Ykä Ydinvoimamies",
            "message": ele.value,
            "date": new Date().toISOString(),
            "thumbs": 0
        }


        database.ref("/" + numOfPosts).set(linkData);
        updatePosts()

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
    var name = ele.children[1].innerHTML
    console.log(name)
    document.getElementById("dialog").style.display = "block"
    document.getElementById("happeningName").innerHTML = name
}