import React from "react";

export function Notes() {
  return (
    <main>
        <div class="page-content">
            <div class = "notebook_bar">
                <li><a href="notes.html" class = "bar-item-button">Notebook1</a></li>
                <li><a href="#" class = "bar-item-button">Notebook2</a></li>
                <li><a href="#" class = "bar-item-button">Notebook3</a></li>
                <button class="new_notebook" type="button">New Notebook</button>
            </div>  

        <div className="content-notes">
          <div className="note">
            <h1>Notebook1 - Page1</h1>
            <h3>This is one of the Notebook pages.</h3>
            <p>Paragraph text...</p>
            <p>More paragraph text...</p>
          </div>

          <div className="stickynotes">
            <div className="sticky-note">
              This is a small sticky note to the side.
            </div>

            <div className="index-card">
              <img
                src="/images/starryexampleimg.png"
                alt="Blue Links"
                width="250"
              />
              <p>This is the starry night painting</p>

              <ul>
                <li>It is a beautiful painting</li>
                <li>I love the colors</li>
                <li>This is a note for ideas</li>
              </ul>
            </div>
          </div>

          <div className="New-Note">
            <form>
              <label htmlFor="title">Title: </label>
              <input type="text" id="title" name="title" />
              <br /><br />

              <label htmlFor="note">Text:</label>
              <input type="text" id="note" name="note" />
              <br /><br />
            </form>
          </div>

        </div>
      </div>
    </main>
  );
}