const prisma = require('../utils/prisma.js');

const createNewPersonal = async (data) => {
    try {
        const personal = await prisma.$transaction(async tx => {
            try {
                const result = await tx.personal.create({
                    data: {
                        name: data.name,
                        password: data.password,
                        gender: data.gender,
                        date_of_birth: new Date(data.date_of_birth),
                        phone_number: data.phone_number,
                        occupation: data.occupation,
                        relationship_status: data.relationship_status,
                        users: {
                            connect: {
                                user_id: data.user_id //    Use `connect` to link existing user
                            }
                        }
                    }
                });

                return result
            } catch (error) {
                throw error
            }
        })

        return personal;
    } catch (error) {
        console.error("Service error creating personal:");
        throw error;
    }
};


const getPersonalByUserId = async (id) => {
    try {

        const responsePersonal = await prisma.personal.findFirst({
            where: {
                user_id: id
            }
        });
        const responseUser= await prisma.users.findFirst({
            where:{
                user_id: id
            }
        })
        
        const responseData = {
            personal_id: responsePersonal.personal_id,
            email: responseUser.email,
            name: responsePersonal.name,
            gender: responsePersonal.gender,
            date_of_birth: responsePersonal.date_of_birth,
            occupation: responsePersonal.occupation,
            relationship_status: responsePersonal.relationship_status,
            phone_number: responsePersonal.phone_number,
            

        }
        return responseData


    } catch (error) {
        throw error;
    }
};


const updatePersonal = async (id, data) => {
    try {
        const personal = await prisma.$transaction(async tx => {
            try {
                const result = await tx.personal.update({
                    where: {
                        personal_id: id
                    },
                    data: {
                        name: data.name,
                        gender: data.gender,
                        date_of_birth: data.date_of_birth,
                        phone_number: data.phone_number,
                        occupation: data.occupation,
                        relationship_status: data.relationship_status,
                        password: data.password
                    }
                });

                return result
            } catch (error) {
                throw error
            }
        })

        return personal;
    } catch (error) {
        console.error("Service error updating personal:");
        throw error;
    }
};

const deletePersonal = async (id) => {
    try {
        const personal = await prisma.$transaction(async tx => {
            try {
                const result = await tx.personal.delete({
                    where: {
                        personal_id: id
                    },
                });

                return result
            } catch (error) {
                console.log("service error while delete personal");

                throw error
            }
        })

        return personal;
    } catch (error) {
        console.error("Service error deleting personal:");
        throw error
    }
};
const findUserById = async (user_id) => {
    try {

        const response = await prisma.personal.findFirst({
            where: {
                user_id: user_id
            }
        })
        return response
    } catch (err) {
        throw err
    }
}
const getPersonalById = async (id) => {
    try {
        const response = await prisma.personal.findFirst({
            where: {
                personal_id: id
            }
        })
        return response
    } catch (err) {
        throw err
    }

}
module.exports = {
    createNewPersonal,
    getPersonalById,
    getPersonalByUserId,
    updatePersonal,
    deletePersonal,
    findUserById
};