import { APIError } from "../app";
import { Vendor } from "../models/vendor";
import { CreateVendorRequestValidation } from "./validation";

export async function createVendor(data) {
  try {
    const validatedData = await CreateVendorRequestValidation.validateAsync(
      data
    );
    const isVendorExist = await Vendor.findOne({
      where: { vendorName: validatedData.vendorName },
    });
    if (isVendorExist) {
      throw new APIError("Vendor with the given name alredy exist");
    }
    const newVendor = await Vendor.create(data);
    if (newVendor) {
      return { status: "Success", data: newVendor };
    }
    return { status: "failed", data: "Unable to create the vendor" };
  } catch (e) {
    throw new APIError((e as APIError).message, (e as APIError).code);
  }
}
export async function getListOfVendor() {
  try {
    const vendorList = await Vendor.findAll({ raw: true });

    return { status: "success", data: vendorList };
  } catch (e) {
    throw new APIError((e as APIError).message, (e as APIError).code);
  }
}
