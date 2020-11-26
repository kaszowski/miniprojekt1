var express = require("express")
var app = express()
const PORT = process.env.PORT || 3000;
var Registry = [];
var isLoggedIn = false;

var path = require("path")

app.use(express.static(path.join(__dirname, 'html')))

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/html/index.html"))
})
app.get("/main", function (req, res) {
    res.sendFile(path.join(__dirname + "/html/index.html"))
})
app.get("/register", function(req, res){ 
    if(!req.query.login) res.sendFile(path.join(__dirname + "/html/register.html"))
    else
    {
        var isLoginOriginal = true;
        for(var i=0; i<Registry.length; i++)
        {
            if(Registry[i].login==req.query.login) isLoginOriginal = false;
        }
        if(isLoginOriginal) res.send("Dane wysłane");
        else res.send("Login powtórzony");
        Registry.push(req.query);
        Registry[Registry.length-1].id=Registry.length;
    }
    console.log(Registry);
})
app.get("/login", function(req, res){
    if(req.query.login)
    {
        //console.log(req.query!={});
        var isLoginCorrect = false;
        for(var i=0; i<Registry.length; i++)
        {
            if((req.query.login==Registry[i].login)&&(req.query.password==Registry[i].password))
            {
                isLoginCorrect = true;
            }
        }
        if(isLoginCorrect)
        {
            isLoggedIn = true;
            res.redirect("/admin");
        }
    }
    else res.sendFile(path.join(__dirname + "/html/login.html"))
})
app.get("/admin", function(req, res){
    if(isLoggedIn)
    {
        res.sendFile(path.join(__dirname + "/html/adminUnlocked.html"))
    }
    else res.sendFile(path.join(__dirname + "/html/adminLocked.html"))
})
app.get("/show", function(req, res){
    if(isLoggedIn)
    {
        var style = '<link rel="stylesheet" href="style2.css"></link>'
        var menu="<div>";
        menu+='<a href="/gender">gender</a>    '
        menu+='<a href="/sort">sort</a>    '
        menu+='<a href="/show">show</a>'
        menu+="</div>"
        var table="<table>";
        for(var i=0; i<Registry.length; i++)
        {
            table+="<tr>";
            table+="<td>id: "+(i+1)+"</td>";
            table+="<td>user: "+Registry[i].login+" PASS: "+Registry[i].password+"</td>";
            table+='<td>uczeń: <input type="checkbox"';
            if(Registry[i].isStudent=="on") table+="checked";
            table+=">";
            table+="<td>wiek: "+Registry[i].age+"</td>";
            table+="<td>płeć: "+Registry[i].sex+"</td>";
            table+="</tr>";
        }
        table+="</table>";
        res.send(style + menu + table);
        //res.sendFile(path.join(__dirname + "/html/adminUnlocked.html"))
    }
    else res.redirect("/login")
})
app.get("/gender", function(req, res){
    if(isLoggedIn)
    {
        var style = '<link rel="stylesheet" href="style2.css"></link>'
        var menu="<div>"
        menu+='<a href="/gender">gender</a>    '
        menu+='<a href="/sort">sort</a>    '
        menu+='<a href="/show">show</a>'
        menu+="</div>"
        var maleTable = "<table>"
        var femaleTable = "<table>"
        for(var i=0; i<Registry.length; i++)
        {
            if(Registry[i].sex=="M") maleTable+="<tr><td>user: "+Registry[i].login+" </td><td> płeć: M</td></tr>";
            else femaleTable+="<tr><td>user: "+Registry[i].login+" </td><td> płeć: K</td></tr>";
        }
        maleTable += "</table>"
        femaleTable+= "</table>"
        res.send(style + menu + maleTable + femaleTable);
    }
    else res.redirect("/login")
})

var sortType = true //true - rosnąco
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.get("/sort", function(req, res){
    sortingPage(req, res)
    
})
app.post("/sort", function(req, res){
    sortingPage(req, res);
})

function sortingPage(req, res)
{
    var style = '<link rel="stylesheet" href="style2.css"></link>'
    var menu="<div>";
    menu+='<a href="/gender">gender</a>    '
    menu+='<a href="/sort">sort</a>    '
    menu+='<a href="/show">show</a>'
    menu+="</div>"
    menu+='<form onchange="this.submit()" method="POST" action="sort" id="sorting">'
    if(req.body.sortOrder=='1')
    {
        menu+='<input type="radio" name="sortOrder" value=1 checked>Malejąco'
        menu+='<input type="radio" name="sortOrder" value=2>Rosnąco'
    }
    else if(req.body.sortOrder=='2')
    {
        menu+='<input type="radio" name="sortOrder" value=1>Malejąco'
        menu+='<input type="radio" name="sortOrder" value=2 checked>Rosnąco'
    }
    else
    {
        menu+='<input type="radio" name="sortOrder" value=1>Malejąco'
        menu+='<input type="radio" name="sortOrder" value=2 checked>Rosnąco'
    }
    menu+="</form>"
    Registry.sort(function(a, b){return b.age - a.age});
    console.log("After sorting: ")
    if(req.body.sortOrder=="2")
    {
        Registry.reverse()
    }
    var table = "<table>"
    for(var i=0; i<Registry.length; i++)
    {
        table+="<tr><td>id: "+Registry[i].id+"</td>"
        table+="<td>user: "+Registry[i].login+" - "+Registry[i].password+"</td>"
        table+="<td>wiek: "+Registry[i].age+"</td></tr>"

    }
    table+="</table>"
    res.send(style + menu + table);
}
app.get("/logout", function(req, res){
    isLoggedIn = false;
    res.redirect("/main")
})

app.listen(PORT, function () { 
    console.log("start serwera na porcie " + PORT )
})