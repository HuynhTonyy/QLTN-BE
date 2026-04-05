const mongoose = require("mongoose");

const PersonnelSchema = new mongoose.Schema(
  {
    personalInfo: {
      birthName: { type: String, required: true, trim: true },
      commonName: { type: String, trim: true },
      birthDate: { type: Date, required: true },
      idNumber: { type: String, required: true, trim: true },
      issueDate: { type: Date },
      birthPlace: {type: String},
      hometown: {type: String},
      ethnicity: {type: String},
      religion: {type: String},
      phone: {
        type: String,
        match: /^[0-9]{9,11}$/
      }
    },

    residence: {
      familyAddress: {type: String},
      currentAddress: {type: String}
    },

    background: {
      familyComponent: {type: String},
      selfComponent: {type: String},
      birthOrder: { type: Number },
      parentsTotalChildren: { type: Number },
      selfTotalChildren: { type: Number }
    },

    education: {
      educationLevel: {type: String},    
      professionalLevel: {type: String},
      graduationYear: { type: Number },
      major: {type: String},
      foreignLanguage: {type: String}
    },

    partyInfo: {
      partyJoinDate: { type: Date },
      officialDate: { type: Date },
      youthUnionJoinDate: { type: Date }
    },

    career: {
      job: String,
      salaryGrade: {type: String},
      salaryLevel: {type: String},
      workplace: {type: String},
      reward: {type: String},
      discipline: {type: String}
    },

    family: {
      father: {
        name: {type: String},
        birthYear: { type: Number },
        job: {type: String},
        status: {
          type: String,
          enum: ["Sống", "Chết", "Không rõ"],
          default: "Sống"
        },
        before1975: {type: String},
        after1975: {type: String}
      },

      mother: {
        name: {type: String},
        birthYear: { type: Number },
        job: {type: String},
        hometown: {type: String},
        component: {type: String},
        status: {
          type: String,
          enum: ["Sống", "Chết", "Không rõ"],
          default: "Sống"
        },
        before1975: {type: String},
        after1975: {type: String}
      },

      spouse: {
        name: {type: String},
        birthYear: { type: Number },
        job: {type: String}
      },

      siblings: [
        {
          relation: {
            type: String,
            enum: ["Anh trai", "Chị gái", "Em trai","Em gái"],
            default: "Anh trai"
            },
          name: {type: String},
          birthYear: { type: Number },
          address: {type: String}
        }
      ]
    },

    educationHistory: [
      {
        period: {type: String},
        description: {type: String}
      }
    ],

    localComment: {type: String},
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

PersonnelSchema.index({ "personalInfo.idNumber": 1 }, { unique: true });
PersonnelSchema.index({ "personalInfo.birthName": "text" });

module.exports = mongoose.model("Personnel", PersonnelSchema);