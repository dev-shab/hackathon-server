// {
//     "provider_id": "ObjectId",
//     "first_name": "String",
//     "last_name": "String",
//     "specialization": "String",
//     "contact_info": {
//       "phone": "String",
//       "email": "String",
//       "address": {
//         "street": "String",
//         "city": "String",
//         "state": "String",
//         "zip_code": "String"
//       }
//     },
//     "patients": [
//       {
//         "patient_id": "ObjectId",
//         "first_name": "String",
//         "last_name": "String",
//         "date_of_birth": "Date"
//       }
//     ],
//     "appointments": [
//       {
//         "appointment_id": "ObjectId",
//         "patient_id": "ObjectId",
//         "date": "Date",
//         "reason": "String",
//         "notes": "String"
//       }
//     ]
//   }

//   {
//     "_id": "unique_provider_id",
//     "name": "Dr. Jane Smith",
//     "specialization": "Cardiologist",
//     "contact": {
//       "phone": "987-654-3210",
//       "email": "janesmith@hospital.com"
//     },
//     "patients": ["unique_patient_id_1", "unique_patient_id_2"]
//   }
  
  