export const defaultContent = {
  html: `
<img src="https://cdn.pixabay.com/photo/2017/08/06/20/19/orange-2595941_1280.jpg" />

<h1>HTML Ipsum Presents</h1>

<p><strong>Pellentesque habitant morbi tristique</strong> senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. <em>Aenean ultricies mi vitae est.</em> Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, <code>commodo vitae</code>, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. <a href="#">Donec non enim</a> in turpis pulvinar facilisis. Ut felis.</p>

<h2>Header Level 2</h2>

<ol>
  <li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li>
  <li>Aliquam tincidunt mauris eu risus.</li>
</ol>

<blockquote><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus magna. Cras in mi at felis aliquet congue. Ut a est eget ligula molestie gravida. Curabitur massa. Donec eleifend, libero at sagittis mollis, tellus est malesuada tellus, at luctus turpis elit sit amet quam. Vivamus pretium ornare est.</p></blockquote>

<h3>Header Level 3</h3>

<ul>
  <li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li>
  <li>Aliquam tincidunt mauris eu risus.</li>
</ul>

<br />
<hr />
<br />

<pre><code>
#header h1 a {
  display: block;
  width: 300px;
  height: 80px;
}
</code></pre>

<div data-youtube-video>
  <iframe src="https://www.youtube.com/watch?v=cVKCNmSfayw"></iframe>
</div>
`,
  json: JSON.stringify({
    type: 'doc',
    content: [
      {
        type: 'image',
        attrs: {
          src: 'https://cdn.pixabay.com/photo/2017/08/06/20/19/orange-2595941_1280.jpg',
          alt: null,
          title: null,
        },
      },
      {
        type: 'heading',
        attrs: {
          level: 1,
        },
        content: [
          {
            type: 'text',
            text: 'HTML Ipsum Presents',
          },
        ],
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            marks: [
              {
                type: 'bold',
              },
            ],
            text: 'Pellentesque habitant morbi tristique',
          },
          {
            type: 'text',
            text: ' senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. ',
          },
          {
            type: 'text',
            marks: [
              {
                type: 'italic',
              },
            ],
            text: 'Aenean ultricies mi vitae est.',
          },
          {
            type: 'text',
            text: ' Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, ',
          },
          {
            type: 'text',
            marks: [
              {
                type: 'code',
              },
            ],
            text: 'commodo vitae',
          },
          {
            type: 'text',
            text: ', ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. ',
          },
          {
            type: 'text',
            marks: [
              {
                type: 'link',
                attrs: {
                  href: '#',
                  target: '_blank',
                  rel: 'noopener noreferrer nofollow',
                  class: null,
                },
              },
            ],
            text: 'Donec non enim',
          },
          {
            type: 'text',
            text: ' in turpis pulvinar facilisis. Ut felis.',
          },
        ],
      },
      {
        type: 'heading',
        attrs: {
          level: 2,
        },
        content: [
          {
            type: 'text',
            text: 'Header Level 2',
          },
        ],
      },
      {
        type: 'orderedList',
        attrs: {
          start: 1,
        },
        content: [
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
                  },
                ],
              },
            ],
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: 'Aliquam tincidunt mauris eu risus.',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: 'blockquote',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus magna. Cras in mi at felis aliquet congue. Ut a est eget ligula molestie gravida. Curabitur massa. Donec eleifend, libero at sagittis mollis, tellus est malesuada tellus, at luctus turpis elit sit amet quam. Vivamus pretium ornare est.',
              },
            ],
          },
        ],
      },
      {
        type: 'heading',
        attrs: {
          level: 3,
        },
        content: [
          {
            type: 'text',
            text: 'Header Level 3',
          },
        ],
      },
      {
        type: 'bulletList',
        content: [
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
                  },
                ],
              },
            ],
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: 'Aliquam tincidunt mauris eu risus.',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'hardBreak',
          },
        ],
      },
      {
        type: 'horizontalRule',
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'hardBreak',
          },
        ],
      },
      {
        type: 'codeBlock',
        attrs: {
          language: null,
        },
        content: [
          {
            type: 'text',
            text: '\n#header h1 a {\n  display: block;\n  width: 300px;\n  height: 80px;\n}\n',
          },
        ],
      },
      {
        type: 'youtube',
        attrs: {
          src: 'https://www.youtube.com/watch?v=cVKCNmSfayw',
          start: 0,
          width: 640,
          height: 480,
        },
      },
    ],
  }),
};
