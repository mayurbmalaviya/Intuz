const Joi = require('joi')
const messages = require('../helpers/messages.json')
const constants = require('../config/constants')
const Enquiry = require('../models/enquiry')
const httpStatus = require('http-status')
Joi.objectId = require('joi-objectid')(Joi)

module.exports.Inventory = async (req, res, next) => {
const inventory = {
livingStyle: req.body.livingStyle,
enquiryId: req.body.enquiryId
}
const inventorySchema = Joi.object().keys({
livingStyle: Joi.string().allow('').valid(constants.enums.VALID_LIVING_STYLE).label('livingStyle'),
enquiryId: Joi.objectId().required()
})
const { error } = Joi.validate(inventory, inventorySchema)
let message = ''
if (error) {
const field = error.details[0].path[0]
switch (field) {
case constants.errorConstant.LIVING_STYLE:
message = messages.error.validLivingStyle
break
case constants.errorConstant.ENQUIRY_ID:
message = messages.error.invalidEnquiryId
break
}
return res.status(httpStatus.BAD_REQUEST).json({ message: message })
} else {
const isEnquiryExist = await Enquiry.find({ _id: req.body.enquiryId })
if (!isEnquiryExist) {
return res.status(httpStatus.NOT_FOUND).json({ message: message.error.invalidEnquiryId })
}
next()
}
}