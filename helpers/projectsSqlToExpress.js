"use strict";

/** fromDbToExpress
 * 
 * Input: prjRows
 *   {
 *     '1': [{...}, {...}],
 *     '2': [{...}, {...}],
 *   }
 *  
 *   * Each property in prjRows is a project id, and each value is an array of project objects.
 *   * Most of the data in each project array is duplicated in each project object. 
 *   *This happens because there can be multiple tags, multiple comments, and multiple likes associated with a single project.
 * 
 * Purpose: fromDbToExpress reduces each project array down to a single object and pushes it onto a new array, called 'projects', which is returned from the function.
 */

const fromDbToExpress = (prjRows) => {
  let projects = [];

  for (let prop in prjRows) {
    let prjRow = prjRows[prop].reduce((accumulator, data) => {
      const { id, name, image, repoUrl, siteUrl, description, feedbackRequest, createdAt, lastModified, tagId, tagText, likeId, likerUserId, prjCommentsCount, creatorId, firstName, lastName, photoUrl } = data;

      // Create record containing project-level data
      const newRecord = {id, name, image, repoUrl, siteUrl, description, feedbackRequest, createdAt, lastModified, prjCommentsCount: +prjCommentsCount};
      
      // Store project creator data in an object
      newRecord.creator = { 
        id: creatorId,
        firstName, 
        lastName, 
        photoUrl
      };

      // Store project tags data in an array
      if (tagId) {
        newRecord.tags = [...accumulator.tags, {id: tagId, text: tagText}];
      }
      
      // Store project likes data in an array
      if (likeId) {
        newRecord.likes = [...accumulator.likes, {likeId, likerUserId}];
      }

      return newRecord;

    }, { id: +prop, 
          name: "",
          image: "", 
          repoUrl: "", 
          siteUrl: "", 
          description: "", 
          feedbackRequest: "", 
          createdAt: "", 
          lastModified: "", 
          prjCommentsCount: null,
          creator: {}, 
          tags: [],
          likes: []
    });
    projects.push(prjRow);
  };
  return projects;
}

module.exports = { fromDbToExpress };