function skillsMember() {
    var member = document.getElementById("member");
    var memberSkills = member.value;
    if (memberSkills == "Frontend") {
        var frontend = ["HTML", "CSS", "JavaScript"];
        var list = "";
        for (var i = 0; i < frontend.length; i++) {
            list += "<li>" + frontend[i] + "</li>";
        }
        document.getElementById("frontend").innerHTML = list;
    }
    else if (memberSkills == "Backend") {
        var backend = ["PHP", "MySQL", "NodeJS"];
        var list = "";
        for (var i = 0; i < backend.length; i++) {
            list += "<li>" + backend[i] + "</li>";
        }
        document.getElementById("backend").innerHTML = list;
    }
    else if (memberSkills == "Fullstack") {
        var fullstack = ["HTML", "CSS", "JavaScript", "PHP", "MySQL", "NodeJS"];
        var list = "";
        for (var i = 0; i < fullstack.length; i++) {
            list += "<li>" + fullstack[i] + "</li>";
        }
        document.getElementById("fullstack").innerHTML = list;
    }
    else {
        document.getElementById("frontend").innerHTML = "";
        document.getElementById("backend").innerHTML = "";
        document.getElementById("fullstack").innerHTML = "";
    }
}