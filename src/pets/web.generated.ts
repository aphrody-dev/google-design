// SPDX-License-Identifier: Apache-2.0
// Consume the canonical runtime data; no generated code crosses repository boundaries.
import data from "../../assets/pets/web.json" with { type: "json" };
import type { PetWebData } from "./runtime.ts";
export const PET_WEB = data as unknown as PetWebData;
