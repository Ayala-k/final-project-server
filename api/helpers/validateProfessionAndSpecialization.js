const profession_list = require('../data/professions.json')


exports.isProfession = (inputString) => {
    const lowercaseInput = inputString.toLowerCase();

    return profession_list.some((professionObj) =>
        professionObj.profession.toLowerCase() === lowercaseInput
    );
}

exports.isSpecializationOfProfession = (profession, specialization) => {
    const lowercaseProfession = profession.toLowerCase();

    const matchingProfession = profession_list.find(
        (professionObj) => professionObj.profession.toLowerCase() === lowercaseProfession
    );

    let bool=matchingProfession.specializations.includes(specialization)
    return bool
}