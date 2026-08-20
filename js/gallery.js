

(function () {

    "use strict";


    // ===============================
    // CONFIG
    // ===============================

    const STORAGE_KEY =
        "avatarforge_gallery";



    // ===============================
    // DOM
    // ===============================


    const galleryGrid =
        document.querySelector("#galleryGrid");


    const galleryEmpty =
        document.querySelector("#galleryEmpty");


    const galleryActions =
        document.querySelector("#galleryActions");


    const totalAvatars =
        document.querySelector("#totalAvatars");


    const recentCount =
        document.querySelector("#recentCount");


    const clearBtn =
        document.querySelector("#clearGalleryBtn");



    const filterButtons =
        document.querySelectorAll(".filter-btn");





    // ===============================
    // GET DATA
    // ===============================


    function getAvatars() {


        try {


            return JSON.parse(

                localStorage.getItem(
                    STORAGE_KEY
                )

                || "[]"

            );



        }

        catch (error) {

            return [];

        }


    }




// ===============================
// SAVE DATA
// ===============================


function saveAvatars(data) {


    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(data)

    );


}




// ===============================
// STATS
// ===============================


function updateStats(avatars) {


    if (totalAvatars) {

        totalAvatars.textContent =
            avatars.length;

    }



    const week =
        Date.now()
        -
        (7 * 24 * 60 * 60 * 1000);



    const recent =
        avatars.filter(item => {


            return item.timestamp &&
                new Date(item.timestamp).getTime()
                >
                week;


        });



    if (recentCount) {

        recentCount.textContent =
            recent.length;

    }


}






// ===============================
// RENDER
// ===============================


function renderGallery() {


    let avatars =
        getAvatars();



    updateStats(
        avatars
    );



    const activeFilter =
        document.querySelector(
            ".filter-btn.active"
        )?.dataset.filter
        ||
        "all";




    if (activeFilter === "recent") {


        avatars.sort(
            (a, b) =>
                new Date(b.timestamp)
                -
                new Date(a.timestamp)
        );


    }


    if (activeFilter === "oldest") {


        avatars.sort(
            (a, b) =>
                new Date(a.timestamp)
                -
                new Date(b.timestamp)
        );


    }




    if (!avatars.length) {


        galleryGrid.innerHTML = "";


        galleryEmpty.style.display =
            "block";


        galleryActions.style.display =
            "none";


        return;


    }



    galleryEmpty.style.display =
        "none";


    galleryActions.style.display =
        "block";



    galleryGrid.innerHTML =
        avatars.map(
            avatar => createCard(avatar)
        ).join("");



    attachEvents();


}




// ===============================
// CARD DESIGN
// ===============================


function createCard(avatar) {


    return `


<div class="avatar-card">


<div class="avatar-card-preview">


${avatar.thumbnail

            ?

            `

<img 
src="${avatar.thumbnail}"
alt="${avatar.name}"
>

`

            :

            `

<i class="fas fa-user-circle"></i>

`

        }


</div>



<div class="avatar-card-info">


<h4>
${avatar.name || "Avatar"}
</h4>


<p>

<i class="far fa-calendar"></i>

${avatar.date || "Unknown"}

</p>


${avatar.style

            ?

            `

<p class="avatar-style">
Style:
${avatar.style}
</p>

`

            : ""

        }


</div>




<div class="avatar-card-actions">


<button 
class="btn btn-primary btn-sm view-btn"
data-id="${avatar.id}"
>

<i class="fas fa-eye"></i>

View

</button>



<button
class="btn btn-outline btn-sm delete-btn"
data-id="${avatar.id}"
>

<i class="fas fa-trash"></i>

</button>


</div>


</div>


`;

}




// ===============================
// EVENTS
// ===============================


function attachEvents() {


    document
        .querySelectorAll(".delete-btn")
        .forEach(btn => {


            btn.onclick = () => {


                deleteAvatar(
                    Number(btn.dataset.id)
                );


            };


        });



    document
        .querySelectorAll(".view-btn")
        .forEach(btn => {


            btn.onclick = () => {


                viewAvatar(
                    Number(btn.dataset.id)
                );


            };


        });



}


// ===============================
// DELETE AVATAR
// ===============================


function deleteAvatar(id){


let avatars =
getAvatars();



avatars =
avatars.filter(
item=>item.id !== id
);



saveAvatars(
avatars
);



toast(
"Avatar deleted",
"success"
);



renderGallery();


}




// ===============================
// VIEW AVATAR MODAL
// ===============================


function viewAvatar(id){


const avatars =
getAvatars();



const avatar =
avatars.find(
item=>item.id === id
);



if(!avatar){
return;
}



const modal =
document.createElement(
"div"
);



modal.className =
"avatar-modal";



modal.innerHTML = `


<div class="modal-box">


<button class="modal-close">
×
</button>



<div class="modal-image">


${
avatar.thumbnail

?

`

<img 
src="${avatar.thumbnail}"
alt="${avatar.name}"
>

`

:

`

<i class="fas fa-user-circle"></i>

`

}


</div>



<h2>
${avatar.name || "Avatar"}
</h2>


<p>
Created:
${avatar.date}
</p>


<p class="modal-style">

Style:
${avatar.style || "Realistic"}

</p>



<div class="modal-actions">


${
avatar.modelUrl

?

`

<a 
href="${avatar.modelUrl}"
target="_blank"
class="btn btn-primary">

<i class="fas fa-download"></i>

Download

</a>

`

:""

}



<button class="btn btn-outline close-modal">

Close

</button>


</div>


</div>


`;



document.body.appendChild(
modal
);



const close=()=>{

modal.remove();

};



modal
.querySelector(".modal-close")
.onclick=close;


modal
.querySelector(".close-modal")
.onclick=close;



modal.onclick=(e)=>{


if(e.target===modal){

close();

}

};



}






// ===============================
// FILTERS
// ===============================


filterButtons.forEach(btn=>{


btn.addEventListener(
"click",
()=>{


filterButtons.forEach(
b=>b.classList.remove("active")
);



btn.classList.add(
"active"
);



renderGallery();



}

);


});





// ===============================
// CLEAR ALL
// ===============================


if(clearBtn){


clearBtn.onclick=()=>{


const confirmDelete =
confirm(
"Delete all avatars?"
);



if(confirmDelete){


saveAvatars([]);



toast(
"All avatars removed",
"info"
);



renderGallery();



}



};


}






// ===============================
// TOAST
// ===============================


function toast(
message,
type="info"
){


const old =
document.querySelector(
".gallery-toast"
);



if(old){

old.remove();

}



const colors={

success:"#22c55e",

error:"#ef4444",

info:"#3b82f6"

};



const box =
document.createElement(
"div"
);



box.className =
"gallery-toast";



box.textContent =
message;



Object.assign(
box.style,
{

position:"fixed",

bottom:"30px",

right:"30px",

padding:"14px 22px",

borderRadius:"14px",

background:
colors[type],

color:"#fff",

fontWeight:"600",

zIndex:"99999",

boxShadow:
"0 15px 40px rgba(0,0,0,.35)",

transition:".3s ease"

}

);



document.body.appendChild(
box
);



setTimeout(()=>{


box.style.opacity="0";


setTimeout(()=>{

box.remove();

},300);



},3000);



}





// ===============================
// DEFAULT SAMPLE DATA
// ===============================


function createSamples(){


const avatars =
getAvatars();



if(avatars.length){

return;

}



const samples=[


{

id:Date.now()+1,

name:"Alex Johnson",

date:
new Date().toLocaleDateString(),

timestamp:
new Date().toISOString(),

thumbnail:
"https://i.pravatar.cc/300?img=12",

style:"realistic"

},


{

id:Date.now()+2,

name:"Emma Wilson",

date:
new Date(
Date.now()-86400000
)
.toLocaleDateString(),

timestamp:
new Date(
Date.now()-86400000
)
.toISOString(),

thumbnail:
"https://i.pravatar.cc/300?img=32",

style:"stylized"

},


{

id:Date.now()+3,

name:"David Smith",

date:
new Date(
Date.now()-172800000
)
.toLocaleDateString(),

timestamp:
new Date(
Date.now()-172800000
)
.toISOString(),

thumbnail:
"https://i.pravatar.cc/300?img=45",

style:"cartoon"

}


];



saveAvatars(
samples
);



}





// ===============================
// START
// ===============================


createSamples();


renderGallery();



console.log(
"🖼️ AvatarForge Gallery v2 Loaded"
);



})();
