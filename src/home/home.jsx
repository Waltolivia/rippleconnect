import React from "react";

export function Home() {
  return (
    <main>
    <div class="page-content">
        <div class = "notebook_bar">
            <li><a href="notes.html" class = "bar-item-button">Notebook1</a></li>
            <li><a href="#" class = "bar-item-button">Notebook2</a></li>
            <li><a href="#" class = "bar-item-button">Notebook3</a></li>
            <button class="new_notebook" type="button">New Notebook</button>
        </div>  

        <div className="content">
          <h1>Home</h1>
          <h3>
            This is a place to make connections, let ideas flow, and let colors help you learn or write what you need to!
          </h3>

          <img src="/images/download.png" alt="Blue Links" />

          <h2>Start a New Note</h2>
          <button className="button_start">Start Here</button>

          <p>
            Notebooks are the home to your ideas and connections. Start one and use the notes,
            pages, and sticky notes inside to help you write!
          </p>

          <div className="Login">
            <form>
              <label htmlFor="username">Username </label>
              <input type="text" id="username" name="username" />
              <br /><br />

              <label htmlFor="password">Password</label>
              <input type="text" id="password" name="password" />
              <br /><br />
            </form>
          </div>

        </div>
      </div>
    </main>
  );
}