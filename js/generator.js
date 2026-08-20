/**
 * AvatarForge AI
 * Generator Engine v2
 */

(function () {
  "use strict";

"use strict";


// ===============================
// CONFIG
// ===============================

const CONFIG = {
    API_URL: "https://api.readyplayer.me/v1/avatar",
    PROXY: "https://api.allorigins.win/raw?url=",
    STORAGE_KEY: "avatarforge_gallery",
    MAX_SIZE: 10 * 1024 * 1024
};


// ===============================
// DOM ELEMENTS
// ===============================

const uploadZone = document.querySelector("#uploadZone");
const imageInput = document.querySelector("#imageInput");
const uploadPreview = document.querySelector("#uploadPreview");
const previewImage = document.querySelector("#previewImage");

const removeImage = document.querySelector("#removeImage");

const generateBtn = document.querySelector("#generateBtn");
const resetBtn = document.querySelector("#resetBtn");

const processingOverlay =
document.querySelector("#processingOverlay");

const progressFill =
document.querySelector("#progressFill");

const processingStatus =
document.querySelector("#processingStatus");


const resultContent =
document.querySelector("#resultContent");

const resultPlaceholder =
document.querySelector(".result-placeholder");


const result3dContainer =
document.querySelector("#result3dContainer");


const downloadBtn =
document.querySelector("#downloadBtn");


const viewGalleryBtn =
document.querySelector("#viewInGalleryBtn");


const styleButtons =
document.querySelectorAll(".style-btn");


// ===============================
// STATE
// ===============================

let uploadedFile = null;
let selectedStyle = "realistic";
let currentModel = null;
let processing = false;




// ===============================
// STYLE SELECTOR
// ===============================


styleButtons.forEach(btn=>{


    btn.addEventListener("click",()=>{


        styleButtons.forEach(b=>
            b.classList.remove("active")
        );


        btn.classList.add("active");


        selectedStyle =
        btn.dataset.style;


    });


});



// ===============================
// IMAGE UPLOAD
// ===============================


function handleUpload(file){


    if(!file.type.startsWith("image/")){

        toast(
        "Please upload image only",
        "error"
        );

        return;
    }


    if(file.size > CONFIG.MAX_SIZE){

        toast(
        "Maximum file size is 10MB",
        "error"
        );

        return;
    }


    uploadedFile=file;


    const reader=new FileReader();


    reader.onload=(e)=>{


        previewImage.src=e.target.result;


        uploadPreview.classList.add(
            "active"
        );


        document
        .querySelector(".upload-content")
        .style.display="none";


        generateBtn.disabled=false;


        toast(
        "Image uploaded successfully",
        "success"
        );


    };


    reader.readAsDataURL(file);

}



// Events

if(imageInput){

imageInput.addEventListener(
"change",
e=>handleUpload(e.target.files[0])
);

}



if(removeImage){

removeImage.onclick=(e)=>{

e.stopPropagation();

resetGenerator();

};

}



if(resetBtn){

resetBtn.onclick=
resetGenerator;

}



});







// ===============================
// GENERATE AVATAR
// ===============================


if(generateBtn){


generateBtn.addEventListener(
"click",
async ()=>{


if(!uploadedFile || processing){
    return;
}


processing=true;

generateBtn.disabled=true;

processingOverlay.classList.add("active");


updateProgress(
10,
"Preparing image..."
);



try{


const base64 =
await convertBase64(uploadedFile);



updateProgress(
30,
"Sending image to AI..."
);



const payload={

    bodyShape:"fullbody",

    gender:"neutral",

    photo:{
        url:base64
    }

};



if(selectedStyle !== "realistic"){

payload.style={
    style:selectedStyle
};

}



const response =
await fetch(
CONFIG.PROXY + CONFIG.API_URL,
{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:
JSON.stringify(payload)

}

);



updateProgress(
60,
"Creating your 3D avatar..."
);



if(!response.ok){

throw new Error(
"Avatar generation failed"
);

}



const data =
await response.json();



const avatar =
data.data?.avatar ||
data.avatar ||
data;



const modelURL =
avatar.glb ||
avatar.model_url ||
avatar.url;



if(!modelURL){

throw new Error(
"No 3D model received"
);

}



updateProgress(
90,
"Loading 3D model..."
);



currentModel=modelURL;



setTimeout(()=>{


processingOverlay.classList.remove(
"active"
);


resultPlaceholder.style.display=
"none";


resultContent.style.display=
"flex";


loadAvatar(modelURL);



saveGallery(
uploadedFile,
avatar
);



downloadBtn.dataset.url=
modelURL;


updateProgress(
100,
"Avatar Ready!"
);



toast(
"Avatar generated successfully 🎉",
"success"
);



processing=false;

generateBtn.disabled=false;


},700);



}

catch(error){


console.error(error);


processingOverlay.classList.remove(
"active"
);


toast(
error.message,
"error"
);


processing=false;

generateBtn.disabled=false;


}



});


}






// ===============================
// HELPERS
// ===============================


function convertBase64(file){


return new Promise(
(resolve,reject)=>{


const reader =
new FileReader();


reader.onload=()=>
resolve(reader.result);


reader.onerror=reject;


reader.readAsDataURL(file);



});


}




function updateProgress(
percent,
message
){

if(progressFill){

progressFill.style.width =
percent+"%";

}


if(processingStatus){

processingStatus.textContent =
message;

}

}




// ===============================
// THREE JS AVATAR VIEWER
// ===============================


let viewer = {

scene:null,
camera:null,
renderer:null,
controls:null,
avatar:null,
ready:false

};





function loadAvatar(modelURL){


if(!result3dContainer){
    return;
}



if(!viewer.ready){

initViewer();

}



const loader =
new THREE.GLTFLoader();



result3dContainer.innerHTML = `

<div style="
height:100%;
display:flex;
align-items:center;
justify-content:center;
flex-direction:column;
gap:15px;
color:#aaa;
">

<div class="spinner-ring"></div>

<p>
Loading 3D Avatar...
</p>

</div>

`;




loader.load(

modelURL,


(gltf)=>{


const model =
gltf.scene;



model.scale.set(
1,
1,
1
);


model.position.y =
0;



// remove old avatar

if(viewer.avatar){

viewer.scene.remove(
viewer.avatar
);

}



viewer.avatar=model;


viewer.scene.add(
model
);



toast(
"3D avatar loaded 🎮",
"success"
);



},



(xhr)=>{


console.log(
"Loading:",
(xhr.loaded/xhr.total)*100+"%"
);



},



(error)=>{


console.error(
error
);


toast(
"Unable to load 3D model",
"error"
);



}



);


}





// ===============================
// INIT VIEWER
// ===============================


function initViewer(){



const container =
result3dContainer;



const scene =
new THREE.Scene();


scene.background =
new THREE.Color(
0x0a0a0f
);




const camera =
new THREE.PerspectiveCamera(

45,

container.clientWidth /
container.clientHeight,

0.1,

1000

);



camera.position.set(
0,
0.5,
3
);




const renderer =
new THREE.WebGLRenderer({

antialias:true,
alpha:true

});



renderer.setSize(

container.clientWidth,

container.clientHeight

);



renderer.setPixelRatio(

Math.min(
window.devicePixelRatio,
2
)

);



renderer.shadowMap.enabled=true;



container.innerHTML="";


container.appendChild(
renderer.domElement
);





// LIGHTS


const ambient =
new THREE.AmbientLight(
0xffffff,
0.5
);


scene.add(
ambient
);




const keyLight =
new THREE.DirectionalLight(
0xffffff,
1.5
);


keyLight.position.set(
3,
4,
5
);


scene.add(
keyLight
);



  const CONFIG = {
    API_URL: "https://api.readyplayer.me/v1/avatar",
    PROXY: "https://api.allorigins.win/raw?url=",
    STORAGE_KEY: "avatarforge_gallery",
    MAX_SIZE: 10 * 1024 * 1024,
  };

  // ===============================
  // DOM ELEMENTS
  // ===============================

  const uploadZone = document.querySelector("#uploadZone");
  const imageInput = document.querySelector("#imageInput");
  const uploadPreview = document.querySelector("#uploadPreview");
  const previewImage = document.querySelector("#previewImage");

  const removeImage = document.querySelector("#removeImage");

  const generateBtn = document.querySelector("#generateBtn");
  const resetBtn = document.querySelector("#resetBtn");

  const processingOverlay = document.querySelector("#processingOverlay");

  const progressFill = document.querySelector("#progressFill");

  const processingStatus = document.querySelector("#processingStatus");

  const resultContent = document.querySelector("#resultContent");

  const resultPlaceholder = document.querySelector(".result-placeholder");

  const result3dContainer = document.querySelector("#result3dContainer");

  const downloadBtn = document.querySelector("#downloadBtn");

  const viewGalleryBtn = document.querySelector("#viewInGalleryBtn");

  const styleButtons = document.querySelectorAll(".style-btn");

  // ===============================
  // STATE
  // ===============================

  let uploadedFile = null;
  let selectedStyle = "realistic";
  let currentModel = null;
  let processing = false;

  // ===============================
  // NAVBAR MOBILE
  // ===============================

  const navToggle = document.querySelector("#navToggle");

  const navLinks = document.querySelector("#navLinks");

  if (navToggle) {
    navToggle.onclick = () => {
      navLinks.classList.toggle("open");
    };
  }

  // ===============================
  // STYLE SELECTOR
  // ===============================

  styleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      styleButtons.forEach((b) => b.classList.remove("active"));

      btn.classList.add("active");

      selectedStyle = btn.dataset.style;
    });
  });

  // ===============================
  // IMAGE UPLOAD
  // ===============================

  function handleUpload(file) {
    if (!file.type.startsWith("image/")) {
      toast("Please upload image only", "error");

      return;
    }

    if (file.size > CONFIG.MAX_SIZE) {
      toast("Maximum file size is 10MB", "error");

      return;
    }

    uploadedFile = file;

    const reader = new FileReader();

    reader.onload = (e) => {
      previewImage.src = e.target.result;

      uploadPreview.classList.add("active");

      document.querySelector(".upload-content").style.display = "none";

      generateBtn.disabled = false;

      toast("Image uploaded successfully", "success");
    };

    reader.readAsDataURL(file);
  }

  // Events

  if (imageInput) {
    imageInput.addEventListener("change", (e) =>
      handleUpload(e.target.files[0]),
    );
  }

  if (removeImage) {
    removeImage.onclick = (e) => {
      e.stopPropagation();

      resetGenerator();
    };
  }

  if (resetBtn) {
    resetBtn.onclick = resetGenerator;
  }
});

// ===============================
// GENERATE AVATAR
// ===============================

if (generateBtn) {
  generateBtn.addEventListener("click", async () => {
    if (!uploadedFile || processing) {
      return;
    }

    processing = true;

    generateBtn.disabled = true;

    processingOverlay.classList.add("active");

    updateProgress(10, "Preparing image...");

    try {
      const base64 = await convertBase64(uploadedFile);

      updateProgress(30, "Sending image to AI...");

      const payload = {
        bodyShape: "fullbody",

        gender: "neutral",

        photo: {
          url: base64,
        },
      };

      if (selectedStyle !== "realistic") {
        payload.style = {
          style: selectedStyle,
        };
      }

      const response = await fetch(CONFIG.PROXY + CONFIG.API_URL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      });

      updateProgress(60, "Creating your 3D avatar...");

      if (!response.ok) {
        throw new Error("Avatar generation failed");
      }

      const data = await response.json();

      const avatar = data.data?.avatar || data.avatar || data;

      const modelURL = avatar.glb || avatar.model_url || avatar.url;

      if (!modelURL) {
        throw new Error("No 3D model received");
      }

      updateProgress(90, "Loading 3D model...");

      currentModel = modelURL;

      setTimeout(() => {
        processingOverlay.classList.remove("active");

        resultPlaceholder.style.display = "none";

        resultContent.style.display = "flex";

        loadAvatar(modelURL);

        saveGallery(uploadedFile, avatar);

        downloadBtn.dataset.url = modelURL;

        updateProgress(100, "Avatar Ready!");

        toast("Avatar generated successfully 🎉", "success");

        processing = false;

        generateBtn.disabled = false;
      }, 700);
    } catch (error) {
      console.error(error);

      processingOverlay.classList.remove("active");

      toast(error.message, "error");

      processing = false;

      generateBtn.disabled = false;
    }
  });
}

// ===============================
// HELPERS
// ===============================

function convertBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);

    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}

function updateProgress(percent, message) {
  if (progressFill) {
    progressFill.style.width = percent + "%";
  }

  if (processingStatus) {
    processingStatus.textContent = message;
  }
}

// ===============================
// THREE JS AVATAR VIEWER
// ===============================

let viewer = {
  scene: null,
  camera: null,
  renderer: null,
  controls: null,
  avatar: null,
  ready: false,
};

function loadAvatar(modelURL) {
  if (!result3dContainer) {
    return;
  }

  if (!viewer.ready) {
    initViewer();
  }

  const loader = new THREE.GLTFLoader();

  result3dContainer.innerHTML = `

<div style="
height:100%;
display:flex;
align-items:center;
justify-content:center;
flex-direction:column;
gap:15px;
color:#aaa;
">

<div class="spinner-ring"></div>

<p>
Loading 3D Avatar...
</p>

</div>

`;

  loader.load(
    modelURL,

    (gltf) => {
      const model = gltf.scene;

      model.scale.set(1, 1, 1);

      model.position.y = 0;

      // remove old avatar

      if (viewer.avatar) {
        viewer.scene.remove(viewer.avatar);
      }

      viewer.avatar = model;

      viewer.scene.add(model);

      toast("3D avatar loaded 🎮", "success");
    },

    (xhr) => {
      console.log("Loading:", (xhr.loaded / xhr.total) * 100 + "%");
    },

    (error) => {
      console.error(error);

      toast("Unable to load 3D model", "error");
    },
  );
}

// ===============================
// INIT VIEWER
// ===============================

function initViewer() {
  const container = result3dContainer;

  const scene = new THREE.Scene();

  scene.background = new THREE.Color(0x0a0a0f);

  const camera = new THREE.PerspectiveCamera(
    45,

    container.clientWidth / container.clientHeight,

    0.1,

    1000,
  );

  camera.position.set(0, 0.5, 3);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });

  renderer.setSize(
    container.clientWidth,

    container.clientHeight,
  );

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  renderer.shadowMap.enabled = true;

  container.innerHTML = "";

  container.appendChild(renderer.domElement);

  // LIGHTS

  const ambient = new THREE.AmbientLight(0xffffff, 0.5);

  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);

  keyLight.position.set(3, 4, 5);

  scene.add(keyLight);

  const purpleLight = new THREE.PointLight(0x7c3aed, 2, 10);

  purpleLight.position.set(-2, 2, 2);

  scene.add(purpleLight);

  // Ground

  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(1.4, 64),

    new THREE.MeshStandardMaterial({
      color: 0x1a1a2e,

      roughness: 0.8,

      metalness: 0.2,
    }),
  );

  ground.rotation.x = -Math.PI / 2;

  ground.position.y = -0.9;

  scene.add(ground);

  // Controls

  const controls = new THREE.OrbitControls(
    camera,

    renderer.domElement,
  );

  controls.enableDamping = true;

  controls.dampingFactor = 0.05;

  controls.autoRotate = true;

  controls.autoRotateSpeed = 1.5;

  controls.enablePan = false;

  controls.minDistance = 1.5;

  controls.maxDistance = 5;

  controls.target.set(0, 0, 0);

  viewer.scene = scene;

  viewer.camera = camera;

  viewer.renderer = renderer;

  viewer.controls = controls;

  viewer.ready = true;

  animateViewer();

  resizeViewer();
}

// ===============================
// ANIMATION
// ===============================

function animateViewer() {
  requestAnimationFrame(animateViewer);

  if (viewer.controls) {
    viewer.controls.update();
  }

  if (viewer.renderer) {
    viewer.renderer.render(
      viewer.scene,

      viewer.camera,
    );
  }
}

// ===============================
// RESPONSIVE
// ===============================

function resizeViewer() {
  if (!result3dContainer) {
    return;
  }

  const resize = () => {
    const w = result3dContainer.clientWidth;

    const h = result3dContainer.clientHeight;

    if (w && h) {
      viewer.camera.aspect = w / h;

      viewer.camera.updateProjectionMatrix();

      viewer.renderer.setSize(w, h);
    }
  };

  new ResizeObserver(resize).observe(result3dContainer);

  window.addEventListener("resize", resize);
}

// ===============================
// CLEANUP
// ===============================

function cleanupViewer() {
  if (viewer.renderer) {
    viewer.renderer.dispose();
  }

  if (viewer.controls) {
    viewer.controls.dispose();
  }

  viewer.scene = null;

  viewer.camera = null;

  viewer.renderer = null;

  viewer.controls = null;

  viewer.avatar = null;

  viewer.ready = false;
}

// ===============================
// SAVE TO GALLERY
// ===============================

function saveGallery(imageFile, avatarData) {
  try {
    const gallery = JSON.parse(
      localStorage.getItem(CONFIG.STORAGE_KEY) || "[]",
    );

    const reader = new FileReader();

    reader.onload = (e) => {
      gallery.unshift({
        id: Date.now(),

        name: "Avatar " + (gallery.length + 1),

        date: new Date().toLocaleDateString(),

        timestamp: new Date().toISOString(),

        thumbnail: e.target.result,

        modelUrl: avatarData.glb || avatarData.model_url || currentModel,

        style: selectedStyle,
      });

      if (gallery.length > 100) {
        gallery.pop();
      }

      localStorage.setItem(
        CONFIG.STORAGE_KEY,

        JSON.stringify(gallery),
      );
    };

    reader.readAsDataURL(imageFile);
  } catch (error) {
    console.warn("Gallery save failed", error);
  }
}

// ===============================
// RESET GENERATOR
// ===============================

function resetGenerator() {
  uploadedFile = null;

  imageInput.value = "";

  previewImage.src = "";

  uploadPreview.classList.remove("active");

  const uploadContent = document.querySelector(".upload-content");

  if (uploadContent) {
    uploadContent.style.display = "block";
  }

  generateBtn.disabled = true;

  resultContent.style.display = "none";

  resultPlaceholder.style.display = "flex";

  processingOverlay.classList.remove("active");

  processing = false;

  currentModel = null;

  cleanupViewer();

  toast("Generator reset", "info");
}

// ===============================
// DOWNLOAD MODEL
// ===============================

if (downloadBtn) {
  downloadBtn.addEventListener("click", () => {
    const url = downloadBtn.dataset.url;

    if (!url) {
      toast("No model available", "error");

      return;
    }

    toast("Downloading avatar...", "info");

    window.open(url, "_blank");
  });
}

// ===============================
// VIEW GALLERY
// ===============================

if (viewGalleryBtn) {
  viewGalleryBtn.addEventListener("click", () => {
    window.location.href = "gallery.html";
  });
}

// ===============================
// TOAST SYSTEM
// ===============================

function toast(message, type = "info") {
  const old = document.querySelector(".avatar-toast");

  if (old) {
    old.remove();
  }

  const colors = {
    success: "#22c55e",

    error: "#ef4444",

    info: "#3b82f6",

    warning: "#eab308",
  };

  const box = document.createElement("div");

  box.className = "avatar-toast";

  box.innerHTML = `

<span>${message}</span>

`;

  Object.assign(box.style, {
    position: "fixed",

    bottom: "30px",

    right: "30px",

    padding: "15px 22px",

    borderRadius: "14px",

    background: colors[type],

    color: "#fff",

    fontFamily: "Inter, sans-serif",

    fontWeight: "600",

    zIndex: "99999",

    boxShadow: "0 15px 40px rgba(0,0,0,.4)",

    transform: "translateY(40px)",

    opacity: "0",

    transition: ".3s ease",
  });

  document.body.appendChild(box);

  requestAnimationFrame(() => {
    box.style.transform = "translateY(0)";

    box.style.opacity = "1";
  });

  setTimeout(() => {
    box.style.transform = "translateY(40px)";

    box.style.opacity = "0";

    setTimeout(() => {
      box.remove();
    }, 300);
  }, 3500);
}

// ===============================
// INITIAL LOAD
// ===============================

console.log("🚀 AvatarForge AI Generator v2 Loaded");
