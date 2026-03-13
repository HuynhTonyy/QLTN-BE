const mongoose = require("mongoose");

const PersonnelSchema = new mongoose.Schema(
  {
    personalInfo: {
      birthName: { type: String, required: true, trim: true },
      commonName: { type: String, trim: true },
      birthDate: { type: Date, required: true },
      idNumber: {type: String, required: true, unique: true, trim: true},
      issueDate: Date,
      birthPlace: String,
      hometown: String,
      ethnicity: String,
      religion: String,
      phone: String
    },

    residence: {
      familyAddress: String,
      currentAddress: String
    },

    background: {
      familyComponent: String,
      selfComponent: String,
      birthOrder: Number,
      parentsTotalChildren: Number,
      selfTotalChildren: Number
    },

    education: {
      educationLevel: String,    
      professionalLevel: String,
      graduationYear: Number,
      major: String,
      foreignLanguage: String
    },

    partyInfo: {
      partyJoinDate: Date,
      officialDate: Date,
      youthUnionJoinDate: Date
    },

    career: {
      job: String,
      salaryGrade: String,
      salaryLevel: String,
      workplace: String,
      reward: String,
      discipline: String
    },

    family: {
      father: {
        name: String,
        birthYear: Number,
        job: String,
        status: {
          type: String,
          enum: ["Sống", "Chết", "Không rõ"],
          default: "Sống"
        },
        before1975: String,
        after1975: String
      },

      mother: {
        name: String,
        birthYear: Number,
        job: String,
        hometown: String,
        component: String,
        status: {
          type: String,
          enum: ["Sống", "Chết", "Không rõ"],
          default: "Sống"
        },
        before1975: String,
        after1975: String
      },

      spouse: {
        name: String,
        birthYear: Number,
        job: String
      },

      siblings: [
        {
          relation: {
            type: String,
            enum: ["Anh trai", "Chị gái", "Em trai","Em gái"],
            default: "Anh trai"
            },
          name: String,
          birthYear: Number,
          address: String
        }
      ]
    },

    educationHistory: [
      {
        period: String,
        description: String
      }
    ],

    localComment: String
  },
  {
    timestamps: true
  }
);

PersonnelSchema.index({ "personalInfo.idNumber": 1 }, { unique: true });
PersonnelSchema.index({ "personalInfo.birthName": "text" });

module.exports = mongoose.model("Personnel", PersonnelSchema);