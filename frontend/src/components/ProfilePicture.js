import React from "react";
import mario from "../media/mario.jpg"
import dk from "../media/dk.jpg"
import yoshi from "../media/yoshi.jpg"
import wario from "../media/wario.jpg"
import waluigi from "../media/waluigi.jpg"
import peach from "../media/peach.jpg"
import toad from "../media/toad.jpg"
import luigi from "../media/luigi.jpg"

export function ProfilePicture(decider){
    const profilePics = [mario, luigi, yoshi, peach, toad, wario, waluigi, dk];

        if (decider == 'a' || decider == 'b' || decider == 'c' || decider == 'd') {
            return profilePics[0];
          }
          else if (decider == 'e' || decider == 'f' || decider == 'g' || decider == 'h') {
            return profilePics[1];
          }
          else if (decider == 'i' || decider == 'j' || decider == 'k' || decider == 'l') {
            return profilePics[2];
          }
          else if (decider == 'm' || decider == 'n' || decider == 'o' || decider == 'p') {
            return profilePics[3];
          }
          else if (decider == 'q' || decider == 'r' || decider == 's' || decider == 't') {
            return profilePics[4];
          }
          else if (decider == 'u' || decider == 'v' || decider == 'w' || decider == 'x') {
            return profilePics[5];
          }
          else if (decider == 'y' || decider == 'z') {
            return profilePics[6];
          }
          else {
            return profilePics[7];
          }
    
}