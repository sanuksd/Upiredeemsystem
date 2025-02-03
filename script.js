console.log("✅ script.js is loaded!");

// ✅ Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyA8J0Cki_dZI6XOetq4CwY7Je23qAMgO2c",
    authDomain: "upiredeeem.firebaseapp.com",
    projectId: "upiredeeem",
    storageBucket: "upiredeeem.appspot.com",
    messagingSenderId: "777635310605",
    appId: "1:777635310605:web:your-app-id"  // Replace with your actual Firebase App ID
};

// ✅ Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

async function validateCoupon() {
    let couponCode = document.getElementById("couponInput").value.trim().toUpperCase();

    if (!couponCode) {
        alert("⚠️ Please enter a coupon code!");
        return;
    }

    try {
        let couponRef = db.collection("coupons").doc(couponCode);
        let doc = await couponRef.get();

        if (doc.exists) {
            let couponData = doc.data();

            if (couponData.used) {
                alert("❌ This coupon has already been used!");
            } else {
                alert("✅ Coupon is valid! Now enter your UPI.");
                document.getElementById("upiSection").style.display = "block"; // Show UPI input
            }
        } else {
            alert("❌ Invalid coupon code!");
        }
    } catch (error) {
        console.error("🚨 Error validating coupon:", error);
        alert("❌ Error connecting to database! Check Firebase setup.");
    }
}

async function saveUPI() {
    let couponCode = document.getElementById("couponInput").value.trim().toUpperCase();
    let upiID = document.getElementById("upiInput").value.trim();

    if (!upiID) {
        alert("⚠️ Please enter a valid UPI ID.");
        return;
    }

    try {
        let couponRef = db.collection("coupons").doc(couponCode);
        let doc = await couponRef.get();

        if (doc.exists && !doc.data().used) {
            await couponRef.update({
                used: true,
                upi: upiID
            });
            alert("✅ UPI saved successfully! This coupon is now used.");
            document.getElementById("upiSection").style.display = "none"; // Hide UPI input
        } else {
            alert("❌ Error: Coupon not found or already used.");
        }
    } catch (error) {
        console.error("🚨 Error saving UPI:", error);
        alert("❌ Error connecting to database!");
    }
}
