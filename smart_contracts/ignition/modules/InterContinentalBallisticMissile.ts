import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const InterContinentalBallisticMissileModule = buildModule(
  "InterContinentalBallisticMissileModule",
  (m) => {
    const iBm = m.contract("InterContinentalBallisticMissile", [
      "0x862A7F74F130A7Aa4E3F7916159A749BB004C4b1",
      "ipfs://QmZtyArTh81gdMFDcQpvZ6FeXQZU5cd6erC5BFnTzRJm9J/",
    ]);

    return { iBm };
  }
);

export default InterContinentalBallisticMissileModule;
