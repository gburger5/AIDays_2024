const mongoose = require("mongoose");
const Image = require("./models/Image");

const emergencyMarkers = [
    {
        zipCode: "34287",
        title: "Emergency Shelter Open",
        description: "University of Florida's O'Connell Center converted to emergency shelter. Accepting displaced residents with capacity for 500 people.",
        imageUrl: "https://www.oconnellcenter.ufl.edu/wp-content/uploads/2023/07/DSC_1852-1024x683.jpg",
        createdAt: "2024-10-27",
        endDate: "2024-10-30",
        latitude: "29.6516",
        longitude: "-82.3248"
    },
    {
        zipCode: "34287",
        title: "Flooding Hazard",
        description: "Ben Hill Griffin Stadium parking lot completely flooded with 3 feet of standing water. Multiple vehicles stranded - avoid area.",
        imageUrl: "https://media.cnn.com/api/v1/images/stellar/prod/gettyimages-2157367531.jpg?q=w_1110,c_fill",
        createdAt: "2024-10-27",
        endDate: "2024-10-29",
        latitude: "29.6520",
        longitude: "-82.3430"
    },
    {
        zipCode: "34287",
        title: "Missing Dog",
        description: "Golden Retriever named Max last seen near Harn Museum during evacuation. Wearing red collar with tags.",
        imageUrl: "https://res.cloudinary.com/dbbbshyvn/image/upload/q_80,w_1300/9CLE3CJ3RS6JJ7JD.jpg",
        createdAt: "2024-10-27",
        endDate: "2024-11-01",
        latitude: "29.6486",
        longitude: "-82.3391"
    },
    {
        zipCode: "34287",
        title: "Water Distribution",
        description: "Florida Museum of Natural History parking lot serving as water distribution point. Free bottled water available from 8AM-6PM.",
        imageUrl: "https://ktul.com/resources/media2/1280x720/1280/648/0x0/80/2f3428bf-938f-4a36-b1aa-3cf8690c5ffc-academywatergiveaway_0018_frame_284.jpeg",
        createdAt: "2024-10-27",
        endDate: "2024-10-31",
        latitude: "29.6436",
        longitude: "-82.3549"
    },
    {
        zipCode: "34287",
        title: "Downed Power Lines",
        description: "Multiple power lines down across Depot Park area. GRU crews en route but area is dangerous. Stay clear of the vicinity.",
        imageUrl: "https://media.istockphoto.com/id/538797042/photo/damaged-trees-and-power-lines-after-natural-disaster-wind-storm.jpg?s=612x612&w=0&k=20&c=0D2rwHvg0dlwHbsqx7sqsRKxRAO7utCFVOrHOSpEOd4=",
        createdAt: "2024-10-27",
        endDate: "2024-10-28",
        latitude: "29.6593",
        longitude: "-82.3232"
    }
];

const populateDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect("mongodb+srv://hacker:hacker123@clusterhack.z7cdt.mongodb.net/?retryWrites=true&w=majority&appName=ClusterHack", {
        });

        console.log("Connected to MongoDB");

        // Insert the emergency markers into the Image collection
        for (const marker of emergencyMarkers) {
            const exists = await Image.exists({ title: marker.title, createdAt: marker.createdAt });
            
            if (!exists) {
                await Image.create(marker); // Insert if it doesn’t already exist
                console.log(`Inserted: ${marker.title}`);
            } else {
                console.log(`Skipped (already exists): ${marker.title}`);
            }
        }
        
        console.log("Data pre-populated successfully");

        // Close the connection
        mongoose.connection.close();
    } catch (error) {
        console.error("Error populating database:", error);
    }
};

populateDatabase();