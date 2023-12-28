const long_profession_list=require('../data/professions.json')


export const isProfession = (inputString) => {
    const lowercaseInput = inputString.toLowerCase();

    return long_profession_list.some((professionObj) =>
        professionObj.profession.toLowerCase() === lowercaseInput
    );
}

export const isSpecializationOfProfession = (profession, specialization) => {
    const lowercaseProfession = profession.toLowerCase();
    const lowercaseSpecialization = specialization.toLowerCase();

    const matchingProfession = long_profession_list.find(
        (professionObj) => professionObj.profession.toLowerCase() === lowercaseProfession
    );

    return matchingProfession
        ? matchingProfession.specializations.includes(lowercaseSpecialization)
        : false;
}