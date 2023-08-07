type Chapter = {
  name: string;
  code: string;
};

type Subject = {
  name: string;
  code: string;
  chapters: Chapter[];
};

type Standard = {
  name: string;
  subjects: Subject[];
};
  
  const getSubjectsByStandard = (standard: string): Subject[] | undefined => {
    const standards: Standard[] = [
      {
        name: "Standard 1",
        subjects: [
          { name: "Mathematics", code: "MATH", chapters:[] },
          { name: "English", code: "ENG", chapters:[] },
          { name: "Science", code: "SCI" , chapters:[]},
        ],
      },
      {
        name: "Standard 2",
        subjects: [
          { name: "Mathematics", code: "MATH" , chapters:[]},
          { name: "English", code: "ENG" , chapters:[]},
          { name: "Social Studies", code: "SOC" , chapters:[]},
        ],
      },
      // Add more standards and subjects as needed
    ];
  
    const selectedStandard = standards.find((std) => std.name === standard);
  
    return selectedStandard ? selectedStandard.subjects : undefined;
  };
  
  // Example usage:
  const standard = "Standard 1";
  const subjects = getSubjectsByStandard(standard);
  
  if (subjects) {
    console.log(`Subjects available for ${standard}:`);
    subjects.forEach((subject) => {
      console.log(`${subject.name} (${subject.code})`);
    });
  } else {
    console.log(`No subjects found for ${standard}`);
  }


  
  const getChaptersBySubject = (subjectCode: string): Chapter[] | undefined => {
    const standards: Standard[] = [
      {
        name: "Standard 1",
        subjects: [
          {
            name: "Mathematics",
            code: "MATH",
            chapters: [
              { name: "Numbers", code: "NUM" },
              { name: "Addition", code: "ADD" },
              { name: "Subtraction", code: "SUB" },
            ],
          },
          {
            name: "English",
            code: "ENG",
            chapters: [
              { name: "Alphabets", code: "ALPH" },
              { name: "Phonetics", code: "PHON" },
              { name: "Vocabulary", code: "VOCAB" },
            ],
          },
          // Add more subjects and chapters as needed
        ],
      },
      {
        name: "Standard 2",
        subjects: [
          {
            name: "Mathematics",
            code: "MATH",
            chapters: [
              { name: "Multiplication", code: "MULT" },
              { name: "Division", code: "DIV" },
            ],
          },
          {
            name: "English",
            code: "ENG",
            chapters: [
              { name: "Grammar", code: "GRAM" },
              { name: "Comprehension", code: "COMP" },
            ],
          },
          // Add more subjects and chapters as needed
        ],
      },
      // Add more standards as needed
    ];
  
    for (const standard of standards) {
      for (const subject of standard.subjects) {
        if (subject.code === subjectCode) {
          return subject.chapters;
        }
      }
    }
  
    return undefined;
  };
  
  
  // Example usage:
  const subjectCode = "MATH";
  const chapters = getChaptersBySubject(subjectCode);
  
  if (chapters) {
    console.log(`Chapters available for subject with code ${subjectCode}:`);
    chapters.forEach((chapter) => {
      console.log(`${chapter.name} (${chapter.code})`);
    });
  } else {
    console.log(`No chapters found for subject with code ${subjectCode}`);
  }
  
  