/* eslint no-shadow: "off" */
enum ClaimFacebookGiftResult {
  ErrorUnknown,
  ErrorCouldNotFindRequest,
  ErrorRequestHasInvalidData,
  ErrorCouldNotDeleteRequest,
  ErrorCouldNotGenerateItemId,
  AlreadyOwnedPermanently,
  RentalTimeProlonged,
  NewItemAttributed,
  ErrorWhileSavingItemChanges,
  ErrorClaimerIsNotReceiver,
}

export default ClaimFacebookGiftResult;
