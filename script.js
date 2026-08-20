// ============================
// AvatarForge AI
// Main JavaScript
// ============================


const uploadInput = document.querySelector("#avatarUpload");
const previewImage = document.querySelector("#previewImage");
const generateBtn = document.querySelector("#generateBtn");
const loadingBox = document.querySelector("#loadingBox");
const resultBox = document.querySelector("#resultBox");



// Image Preview

if(uploadInput){

    uploadInput.addEventListener("change", function(e){

        const file = e.target.files[0];

        if(file){

            const reader = new FileReader();


            reader.onload = function(event){

                previewImage.src = event.target.result;

                previewImage.style.display = "block";

            }


            reader.readAsDataURL(file);

        }

    });

}





// AI Generation Simulation


if(generateBtn){

    generateBtn.addEventListener("click", function(){


        loadingBox.style.display = "block";

        resultBox.style.display = "none";


        generateBtn.disabled = true;

        generateBtn.innerText = "Generating...";


        setTimeout(()=>{


            loadingBox.style.display = "none";


            resultBox.style.display = "block";


            generateBtn.disabled = false;

            generateBtn.innerText = "Generate Avatar";


            alert(
                "🎉 Your AI 3D Avatar is ready!"
            );


        },4000);



    });

}